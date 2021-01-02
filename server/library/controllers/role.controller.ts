import { Role, User } from '@dynrec/common';
import Boom from '@hapi/boom';
import { Any, Brackets } from 'typeorm';
import { Controller, GetRequest, Resource } from '../decorators';
import { PostRequest } from '../decorators/request.decorator';
import { HttpArgs } from '../helpers/route.helper';

@Controller
@Resource(Role, {
    sortable: {
        dataDictionary: {
            course: role => role.course?.name,
            creator: role => (role.creator ? `${role.creator.getFullName()}` : undefined),
        },
    },
    searchable: ['name'],
    dataDict: (args: HttpArgs<Role>) => {
        const { body, currentUser } = args;
        return {
            course: body.course,
            name: body.name,
            creator: body.creator || currentUser,
            abilities: body.abilities || [],
        };
    },
})
export class RoleController {
    async findUsersWithRole(role: Role): Promise<User[]> {
        return User.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .andWhere(new Brackets(qb => qb.where('role.id = :id', { id: role.id })))
            .getMany();
    }

    @GetRequest('/role/:roleID/assignments')
    async getRoleAssignments({ params, ability }: HttpArgs<never, { roleID: string }>): Promise<User[]> {
        const { roleID } = params;

        const role = await Role.findOne({ id: roleID });
        if (!role) {
            throw Boom.notFound('Unable to find selected role.');
        }

        if (!ability.can('update', role)) {
            throw Boom.unauthorized('Unauthorized to view selected role.');
        }

        return this.findUsersWithRole(role);
    }

    @PostRequest('/role/:roleID/assignments')
    async updateRoleAssignments({
        body,
        params,
        ability,
    }: HttpArgs<{ userIds: string[] }, { roleID: string }>): Promise<User[]> {
        const { userIds } = body;
        const { roleID } = params;

        const allUserIds = userIds ?? [];
        const role = await Role.findOne({ id: roleID });
        if (!role) {
            throw Boom.notFound('Unable to find selected role.');
        }

        if (!ability.can('update', role)) {
            throw Boom.unauthorized('Unauthorized to view selected role.');
        }

        // First, we find all users with the current role, and remove any who had it but no longer should
        const usersWithRole = await this.findUsersWithRole(role);
        await Promise.all(
            usersWithRole.map(async user => {
                if (!allUserIds.includes(user.id)) {
                    // eslint-disable-next-line no-param-reassign
                    user.roles = user.roles.filter(uRole => uRole.id !== role.id);
                    await user.save();
                }
            })
        );

        // And now we can ensure everybody who should have a role has a role
        const usersNeedingRole = await User.find({ id: Any(allUserIds) });
        return Promise.all(
            usersNeedingRole.map(async user => {
                user.roles.push(role);
                return user.save();
            })
        );
    }
}
