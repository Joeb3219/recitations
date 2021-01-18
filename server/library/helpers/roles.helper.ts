import { AbilityManager, Course, Role, RoleInterface, RuleTag } from '@dynrec/common';
import _ from 'lodash';
// Generates some requires roles to be used in the system.
export class RolesHelper {
    static readonly SUPER_ADMIN_ROLE_ID = 'd8985a0c-67ad-4709-8e1d-3864735a8906';

    static async upsertSuperAdminRole() {
        const allAbilities = AbilityManager.getAllAbilities(undefined);
        const data: RoleInterface = {
            id: this.SUPER_ADMIN_ROLE_ID,
            name: `Super Admin`,
            abilities: allAbilities.filter(ability => ability.tags?.includes('super_admin')).map(ability => ability.id),
            ruleTag: 'super_admin',
        };

        if (await Role.findOne({ id: this.SUPER_ADMIN_ROLE_ID })) {
            await Role.update({ id: this.SUPER_ADMIN_ROLE_ID }, data);
        } else {
            await Role.insert(data);
        }
    }

    // This is madly inefficient, but it's the easiest way to handle this right now
    // We ensure that the default roles are re-synced at every application launch
    // In the future, we will want to change this to only update those needed
    // when changes actually happen.
    static async upsertAllCourseRoles() {
        const courses = await Course.find();

        await Promise.all(courses.map(async course => this.upsertCourseRoles(course)));
    }

    static async upsertCourseRoles(course: Course) {
        const allAbilities = AbilityManager.getAllAbilities(undefined);

        const ruleTags: RuleTag[] = ['student', 'professor', 'ta', 'course_admin'];
        await Promise.all(
            ruleTags.map(async tag => {
                const data: Omit<RoleInterface, 'id'> = {
                    course,
                    name: _.startCase(tag),
                    abilities: allAbilities.filter(ability => ability.tags?.includes(tag)).map(ability => ability.id),
                    ruleTag: tag,
                };

                if (await Role.findOne({ ruleTag: tag, course })) {
                    await Role.update({ ruleTag: tag, course }, data);
                } else {
                    await Role.insert(data);
                }
            })
        );
    }

    static async getCourseRole(course: Course, type: RuleTag) {
        return Role.findOne({ course, ruleTag: type });
    }
}
