import {
    Course,
    CourseRosterPayload,
    RosterFormatPayload,
    Section,
    UpdateRosterPayload,
    UpdateRosterStudentPayload,
    User,
} from '@dynrec/common';
import * as Boom from '@hapi/boom';
import _ from 'lodash';
import { Any, getConnection } from 'typeorm';
import { Controller, GetRequest, Searchable, Sortable } from '../../decorators';
import { PutRequest } from '../../decorators/request.decorator';
import { HttpArgs } from '../../helpers/route.helper';
import { MeetingManager } from '../meetings/datasource/meeting.manager';
import { ALL_ROSTER_TYPES } from './datasource/index';

@Controller
export class RosterController {
    private getRosterDatasource(rosterType: string) {
        const rosterInstances = ALL_ROSTER_TYPES.map(Roster => new Roster());
        return rosterInstances.find(instance => instance.id === rosterType);
    }

    // This is extremely funky, and in need of a massive refactor, but it's sufficient to get us over the line
    // This function will run a txn for the entirety of the roster update, and generate a changelog
    // If you pass commit: false, no changes will actually be committed to the database -- you'll just get the changelog.
    // allowDeletion: true will allow students to be deleted from the course.
    private async runRosterUpdate(options: {
        course: Course;
        rosterID: string;
        path?: string;
        allowDeletion: boolean;
        commit: boolean;
    }): Promise<UpdateRosterPayload> {
        const { course, rosterID, path, allowDeletion, commit } = options;

        const rosterDatasource = this.getRosterDatasource(rosterID);
        if (!rosterDatasource) {
            throw Boom.notFound(`Failed to find roster format of type ${rosterID}`);
        }

        if (!path) {
            throw new Error('Missing file object');
        }

        // Parse the provided roster.
        const changes = await rosterDatasource.parseRoster(path);
        const sectionsByNumber = _.keyBy(course.sections ?? [], section => section.sectionNumber);
        const sectionsByIndex = _.keyBy(course.sections ?? [], section => section.index);

        // Ensure we only have changes with a username and a section.
        const relevantChanges = changes.filter(
            change =>
                change.user.username &&
                ((change.section.index && sectionsByIndex[change.section.index]) ||
                    (change.section.sectionNumber && sectionsByNumber[change.section.sectionNumber]))
        );

        // Grabs all of the users that are matched by the provided
        const allUsernames = _.compact(relevantChanges.map(change => change.user.username));
        const users = await User.find({ username: Any(allUsernames) });
        const usersByUsername = _.keyBy(users, user => user.username);

        // Load all of the existing sections' users, in an array by id.
        const sectionUsers = (course.sections ?? []).reduce<{ [id: string]: string[] }>((state, section) => {
            return { ...state, [section.id]: (section.students ?? []).map(student => student.username) };
        }, {});

        // Now we can actually push out the changes/generate the changelog.
        // We run all of this in a transaction to (1) prevent faulty data in case of errors, and (2) allow rollbacks if we
        // don't actually want this committed to the database (like for verification).
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        // Now, we begin by creating any usere that are missing.
        const createdUserObjects: Partial<User>[] = relevantChanges
            .filter(change => change.user.username && !usersByUsername[change.user.username])
            .map(change => ({
                username: change.user.username,
                email: change.user.email,
                firstName: change.user.firstName,
                lastName: change.user.lastName,
            }));
        const newUserInserts = await queryRunner.manager.insert<User>(User, createdUserObjects);
        const newUsers = await queryRunner.manager.findByIds(User, newUserInserts.identifiers);

        newUsers.forEach(user => {
            usersByUsername[user.username] = user;
        });

        const updatePayloads: UpdateRosterStudentPayload[] = [];

        const finalSectionStudents: { [id: string]: string[] } = (course.sections ?? []).reduce(
            (state, section) => ({
                ...state,
                [section.id]: [],
            }),
            {}
        );

        // Adds and changes
        relevantChanges.forEach(change => {
            const user = change.user.username && usersByUsername[change.user.username];
            if (!user) {
                return;
            }

            // Find the section they ought to be in
            // We treat it as an error for a student to exist in this array, but with an invalid section.
            const section =
                sectionsByIndex[change.section.index ?? ''] ?? sectionsByNumber[change.section.sectionNumber ?? ''];
            if (!section) {
                return;
            }

            // Now we search for if a section already covered this user
            const existingSectionId = Object.keys(sectionUsers).find(sectionId =>
                sectionUsers[sectionId].includes(user.username)
            );

            finalSectionStudents[section.id]?.push(user.username);

            // They weren't in this course before.
            if (existingSectionId === undefined) {
                updatePayloads.push({
                    user: user.username,
                    moveType: 'created',
                });
                return;
            }

            // They moved... to the same section.
            // No change needed
            if (existingSectionId === section.id) {
                return;
            }

            // They were in the course, but moved to a new section.
            if (existingSectionId !== section.id) {
                updatePayloads.push({
                    user: user.username,
                    moveType: 'moved',
                });
            }
        });

        // Now we process deletions
        const finalStudentList = _.flatMap(
            Object.keys(finalSectionStudents),
            sectionID => finalSectionStudents[sectionID]
        );
        Object.keys(sectionUsers).forEach(sectionId => {
            const remainingUsers = _.intersection(sectionUsers[sectionId], finalStudentList);
            const deletedUsers = sectionUsers[sectionId].filter(username => !remainingUsers.includes(username));

            deletedUsers.forEach(deletedUser => {
                if (allowDeletion) {
                    updatePayloads.push({
                        user: deletedUser,
                        moveType: 'deleted',
                    });
                } else {
                    // Re-add deleted user to the section if we dont' allow deletions.
                    finalSectionStudents[sectionId].push(deletedUser);
                }
            });
        });

        // And now we can actually commit the sections.
        await Promise.all(
            (course.sections ?? []).map(async section => {
                // eslint-disable-next-line no-param-reassign
                section.students = await queryRunner.manager.find(User, {
                    username: Any(finalSectionStudents[section.id] ?? []),
                });

                await queryRunner.manager.save(section);
            })
        );

        await queryRunner.manager.save(course);

        // commit transaction iff commit was requested
        if (commit) {
            await queryRunner.commitTransaction();
        } else {
            await queryRunner.rollbackTransaction();
        }

        await queryRunner.release();

        return {
            updates: updatePayloads,
        };
    }

    @PutRequest('/course/:courseID/roster/:rosterID/verify')
    async verifyRosterChanges({
        params,
        body,
        ability,
    }: HttpArgs<{ rosterPath: string }, { rosterID: string }>): Promise<UpdateRosterPayload> {
        const course = await Course.findOneOrFail(
            { id: params.courseID },
            { relations: ['sections', 'sections.students'] }
        );

        if (!ability.can('update', course)) {
            throw Boom.unauthorized('Unauthorized to update roster.');
        }

        return this.runRosterUpdate({
            course,
            rosterID: params.rosterID,
            path: body.rosterPath,
            commit: false,
            allowDeletion: true,
        });
    }

    @PutRequest('/course/:courseID/roster/:rosterID')
    async updateRoster({
        params,
        body,
        ability,
    }: HttpArgs<{ rosterPath: string }, { rosterID: string }>): Promise<UpdateRosterPayload> {
        const course = await Course.findOneOrFail(
            { id: params.courseID },
            { relations: ['sections', 'sections.students'] }
        );

        if (!ability.can('update', course)) {
            throw Boom.unauthorized('Unauthorized to update roster.');
        }

        return this.runRosterUpdate({
            course,
            rosterID: params.rosterID,
            path: body.rosterPath,
            commit: true,
            allowDeletion: true,
        });
    }

    @GetRequest('/course/:courseID/roster/:rosterID')
    async downloadRoster({ params, ability }: HttpArgs<never, { rosterID: string }>): Promise<string> {
        const rosterInstances = ALL_ROSTER_TYPES.map(Roster => new Roster());
        const downloadFormat = rosterInstances.find(instance => instance.id === params.rosterID);

        const course = await Course.findOne(params.courseID);

        if (!ability.can('update', course)) {
            throw Boom.unauthorized('Unauthorized to fetch roster.');
        }

        if (!downloadFormat) {
            throw Boom.notFound(`Failed to find roster format of type ${params.rosterID}`);
        }

        throw new Error('Not yet implemented');
    }

    @Searchable(['section.index', 'section.sectionNumber', 'student.firstName', 'student.lastName', 'student.username'])
    @Sortable({})
    @GetRequest('/course/:courseId/roster')
    async getCourseRosterList({ params, ability }: HttpArgs<never, unknown>): Promise<CourseRosterPayload[]> {
        const course = await Course.findOne({ id: params.courseId }, { relations: ['sections', 'sections.students'] });
        if (!course) {
            throw Boom.notFound('No course found');
        }

        if (!ability.can('update', course)) {
            throw Boom.unauthorized('Unauthorized to fetch roster.');
        }

        const sectionUsers = await Promise.all(
            (course.sections ?? []).map(async section => {
                return section.students?.map(student => ({
                    student,
                    section,
                }));
            })
        );

        return _.compact(_.flattenDeep(sectionUsers));
    }

    @GetRequest('/course/:courseId/sections-roster')
    async getSectionsRosterList({ params, currentUser, ability }: HttpArgs<never, unknown>): Promise<Section[]> {
        const course = await Course.findOne({ where: { id: params.courseId }, cache: MeetingManager.CACHE_DURATION });

        if (!course) {
            throw Boom.notFound('No course found');
        }

        if (!ability.existsOnCourse('view', 'roster', course)) {
            throw Boom.unauthorized('Unauthorized to fetch roster.');
        }

        const sections = await Section.find({
            where: { course },
            relations: ['students'],
            cache: MeetingManager.CACHE_DURATION,
        });
        return sections.filter(section => ability.can('view', section));
    }

    @GetRequest('/roster/formats')
    async getAvailableRosterFormats(): Promise<RosterFormatPayload[]> {
        return ALL_ROSTER_TYPES.map(Roster => {
            const instance = new Roster();
            return {
                id: instance.id,
                fileTypes: instance.fileTypes,
                name: instance.name,
                description: instance.description,
            };
        });
    }
}
