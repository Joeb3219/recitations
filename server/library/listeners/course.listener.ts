import { Course, Role, Section, User } from '@dynrec/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { RolesHelper } from '../helpers/roles.helper';

@EventSubscriber()
export class CourseListener implements EntitySubscriberInterface<Course> {
    listenTo() {
        return Course;
    }

    async afterInsert(event: InsertEvent<Section>) {
        const { entity } = event;

        // Create roles
        await RolesHelper.createCourseRoles(entity.course);
        const role = await Role.findOne({ course: entity.course, ruleTag: 'course_admin' });

        if (!role || !entity.course.creator) {
            return;
        }

        const creator = await User.findOne({ id: entity.course.creator.id });

        if (!creator) {
            return;
        }

        // Assign the creator
        creator.roles.push(role);
        creator.save();
    }
}
