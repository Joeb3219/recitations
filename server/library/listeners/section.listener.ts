import { Course, Role, Section, User } from '@dynrec/common';
import _ from 'lodash';
import { Any, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class SectionListener implements EntitySubscriberInterface<Section> {
    listenTo() {
        return Section;
    }

    // Grabs all of the users in the course, and corrects their course-tagged roles.
    private async adjustRole(course: Course, oldIds: string[], section?: Section) {
        const roles = await Role.find({ course });
        const taRole = roles.find(role => role.ruleTag === 'ta');
        const professorRole = roles.find(role => role.ruleTag === 'professor');
        const studentRole = roles.find(role => role.ruleTag === 'student');

        // Dirty, awful, and hacky.
        // This should be remedied as soon as possible, this is just gross.
        // Forces out the old entity and replaces it with the updated copy, as typeorm sometimes returns the old entity from this query.
        const baseSections = await Section.find({ course });
        const sections = section ? [...baseSections.filter(s => s.id !== section?.id), section] : baseSections;

        const allTAs = _.compact(_.flatten(sections.map(section => section.ta?.id)));
        const allProfessors = _.compact(_.flatten(sections.map(section => section.instructor?.id)));
        const allStudents = _.compact(
            _.flattenDeep(sections.map(section => (section.students ?? []).map(student => student.id)))
        );

        // Get all users that can potentially be updated
        const affectedUsers = await User.find({
            id: Any(_.uniq([...allTAs, ...allProfessors, ...allStudents, ...oldIds])),
        });

        // And update them if need be
        await Promise.all(
            affectedUsers.map(async user => {
                const oldRoles = user.roles.map(role => role.id);

                // Adds TA
                if (allTAs.includes(user.id)) {
                    if (taRole) user.roles.push(taRole);
                } else if (taRole) {
                    // eslint-disable-next-line no-param-reassign
                    user.roles = user.roles.filter(role => role.id !== taRole.id);
                }

                // Adds Professor
                if (allProfessors.includes(user.id)) {
                    if (professorRole) user.roles.push(professorRole);
                } else if (professorRole) {
                    // eslint-disable-next-line no-param-reassign
                    user.roles = user.roles.filter(role => role.id !== professorRole.id);
                }

                // Adds Student
                if (allStudents.includes(user.id)) {
                    if (studentRole) user.roles.push(studentRole);
                } else if (studentRole) {
                    // eslint-disable-next-line no-param-reassign
                    user.roles = user.roles.filter(role => role.id !== studentRole.id);
                }

                // eslint-disable-next-line no-param-reassign
                user.roles = _.uniqBy(user.roles, role => role.id);

                // Only update if the roles of this user actually changed.
                if (!_.isEqual(_.sortBy(oldRoles), _.sortBy(user.roles.map(role => role.id)))) {
                    await user.save();
                }
            })
        );
    }

    async afterInsert(event: InsertEvent<Section>) {
        const { entity } = event;

        await this.adjustRole(entity.course, [], entity);
    }

    async AfterRemove(event: RemoveEvent<Section>) {
        const { databaseEntity } = event;

        await this.adjustRole(
            databaseEntity.course,
            [
                ...(databaseEntity.ta ? [databaseEntity.ta.id] : []),
                ...(databaseEntity.instructor ? [databaseEntity.instructor.id] : []),
                ...(databaseEntity.students ? databaseEntity.students.map(student => student.id) : []),
            ],
            undefined
        );
    }

    async afterUpdate(event: UpdateEvent<Section>) {
        const { entity, databaseEntity } = event;

        await this.adjustRole(
            entity.course,
            [
                ...(databaseEntity.ta ? [databaseEntity.ta.id] : []),
                ...(databaseEntity.instructor ? [databaseEntity.instructor.id] : []),
                ...(databaseEntity.students ? databaseEntity.students.map(student => student.id) : []),
            ],
            entity
        );
    }
}
