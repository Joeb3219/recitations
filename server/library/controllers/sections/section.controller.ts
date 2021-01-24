import { Course, MeetingTime, MeetingType, Section, SectionSyncFormatPayload, User } from '@dynrec/common';
import Boom from '@hapi/boom';
import * as csv from 'fast-csv';
import _, { get } from 'lodash';
import { Any } from 'typeorm';
import { Controller, GetRequest, Resource } from '../../decorators';
import { PostRequest } from '../../decorators/request.decorator';
import { HttpArgs } from '../../helpers/route.helper';
import { ALL_SECTION_SYNC_TYPES } from './datasource/index';

interface TA_CSV {
    FirstName: string;
    LastName: string;
    Username: string;
    Email: string;
    Recitation: string;
}

@Controller
@Resource(Section, {
    sortable: {
        dataDictionary: {
            course: section => get(section, 'course.name'),
            ta: section => get(section, 'ta.firstName') + ' ' + get(section, 'ta.lastName'),
            instructor: section => get(section, 'instructor.firstName') + ' ' + get(section, 'instructor.lastName'),
        },
    },
    searchable: [
        'index',
        'sectionNumber',
        'ta.firstName',
        'ta.lastName',
        'ta.username',
        'instructor.firstName',
        'instructor.lastName',
        'instructor.username',
    ],
    dataDict: (args: HttpArgs<Section>) => {
        const { body } = args;
        return {
            index: body.index,
            sectionNumber: body.sectionNumber,

            ta: body.ta,
            instructor: body.instructor,
            course: body.course,
            meetingTimes: body.meetingTimes,
        };
    },
})
export class SectionController {
    @GetRequest('/section/formats')
    async getAvailableSectionSyncFormats(): Promise<SectionSyncFormatPayload[]> {
        return ALL_SECTION_SYNC_TYPES.map(Roster => {
            const instance = new Roster();
            return {
                id: instance.id,
                name: instance.name,
                description: instance.description,
            };
        });
    }

    @GetRequest('/course/:courseID/sections/sync/:syncID')
    async syncSections({ params, ability }: HttpArgs<never, { syncID: string }>): Promise<Section[]> {
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });
        if (!course) {
            throw Boom.notFound('No course found');
        }

        if (!ability.can('update', course)) {
            throw Boom.unauthorized('Unauthorized to sync sections');
        }

        // Attempt to find the target sync datasource
        const datasourceInstances = ALL_SECTION_SYNC_TYPES.map(SyncFormat => new SyncFormat());
        const datasource = datasourceInstances.find(instance => instance.id === params.syncID);
        if (!datasource) {
            throw Boom.notFound('Provided sync format not found');
        }

        // Run the data source to fetch the relevant updates
        const updatedSections = await datasource.fetchSections(course);

        // And now we can apply them!
        await Promise.all(
            updatedSections.map(async updated => {
                const original = course.sections?.find(
                    section => section.index === updated.index || section.sectionNumber === updated.sectionNumber
                );

                // Couldn't find a matching section.... so we'll create one!
                if (!original) {
                    const section = new Section({
                        index: updated.index,
                        sectionNumber: updated.sectionNumber,
                        meetingTimes: updated.meetingTimes.map(
                            time =>
                                new MeetingTime({
                                    startTime: time.startTime,
                                    endTime: time.endTime,
                                    type: time.type,
                                    weekday: time.weekday,
                                    frequency: time.frequency,
                                })
                        ),
                    });

                    course.sections?.push(section);
                } else {
                    // Now we can update the existing
                    original.index = updated.index ?? original.index;
                    original.sectionNumber = updated.sectionNumber ?? original.sectionNumber;
                    original.meetingTimes =
                        updated.meetingTimes.map(
                            time =>
                                new MeetingTime({
                                    startTime: time.startTime,
                                    endTime: time.endTime,
                                    type: time.type,
                                    weekday: time.weekday,
                                    frequency: time.frequency,
                                    leader: original.meetingTimes?.find(oTime => oTime.type === time.type)?.leader,
                                })
                        ) ?? original.meetingTimes;
                }
            })
        );

        await course.save();

        return course.sections ?? [];
    }

    private async processTAsCSV(path: string): Promise<TA_CSV[]> {
        const parsed = await csv.parseFile<csv.ParserRow<TA_CSV>, csv.ParserRow<TA_CSV>>(path, {
            skipLines: 0,
            headers: ['FirstName', 'LastName', 'Username', 'Email', 'Recitation'],
            discardUnmappedColumns: true,
            strictColumnHandling: true,
            renameHeaders: true,
        });
        const rows: TA_CSV[] = [];
        return new Promise((resolve, reject) => {
            parsed
                .on('data', row => rows.push(row))
                .on('end', () => resolve(rows))
                .on('error', err => reject(err));
        });
    }

    @PostRequest('/course/:courseID/sections/sync-tas')
    async syncSectionTAs({
        params,
        ability,
        body,
    }: HttpArgs<{ path: string }, { courseID: string }>): Promise<Section[]> {
        const course = await Course.findOne({ id: params.courseID }, { relations: ['sections'] });
        if (!course) {
            throw Boom.notFound('No course found');
        }

        if (!ability.can('update', course)) {
            throw Boom.unauthorized('Unauthorized to sync TAs');
        }

        if (!body.path) {
            throw Boom.badRequest('Missing file path');
        }

        const rows = await this.processTAsCSV(body.path);

        // Create any outstanding users
        const allUsernames = _.compact(rows.map(row => row.Username));
        const users = await User.find({ username: Any(allUsernames) });
        const usersByUsername = _.keyBy(users, user => user.username);

        const createdUserObjects: Partial<User>[] = _.uniqBy(
            rows.filter(row => row.Username && !usersByUsername[row.Username]),
            user => user.Username
        ).map(row => ({
            username: row.Username,
            email: row.Email,
            firstName: row.FirstName,
            lastName: row.LastName,
        }));
        const newUserInserts = await User.insert(createdUserObjects);
        const newUsers = await User.findByIds(newUserInserts.identifiers);
        newUsers.forEach(user => {
            usersByUsername[user.username] = user;
        });

        await Promise.all(
            (course.sections ?? []).map(async section => {
                const ta = rows.find(row => {
                    const recitationStr = row.Recitation?.split(':')?.[0];
                    return recitationStr && section.sectionNumber === recitationStr;
                });

                // No TA, no worries, we'll just skip this one.
                if (!ta || !ta.Username) {
                    return;
                }

                const user = usersByUsername[ta.Username];

                if (!user) {
                    return;
                }

                // eslint-disable-next-line no-param-reassign
                section.ta = user;
                // eslint-disable-next-line no-param-reassign
                section.meetingTimes = (section.meetingTimes ?? []).map(time =>
                    time.type === MeetingType.RECITATION ? new MeetingTime({ ...time, leader: user }) : time
                );
            })
        );

        await course.save();

        return course.sections ?? [];
    }
}
