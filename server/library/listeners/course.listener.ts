import { Course, Role, User } from '@dynrec/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { RolesHelper } from '../helpers/roles.helper';

@EventSubscriber()
export class CourseListener implements EntitySubscriberInterface<Course> {
    listenTo() {
        return Course;
    }

    async afterInsert(event: InsertEvent<Course>) {
        const { entity } = event;

        // Create roles
        await RolesHelper.upsertCourseRoles(entity);
        const role = await Role.findOne({ course: entity, ruleTag: 'course_admin' });

        if (!role || !entity.creator) {
            return;
        }

        const creator = await User.findOne({ id: entity.creator.id });

        if (!creator) {
            return;
        }

        // Assign the creator
        creator.roles.push(role);
        creator.save();
    }
}
