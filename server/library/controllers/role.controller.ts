import { Role } from '@dynrec/common';
import { Controller, Resource } from '../decorators';
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
export class RoleController {}
