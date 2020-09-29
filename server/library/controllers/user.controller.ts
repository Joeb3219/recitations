import * as Boom from '@hapi/boom';
import { UserHelper } from '@helpers/user.helper';
import { User } from '@models/user';
import {
    Controller,
    GetRequest,
    PostRequest,
    Unauthenticated,
} from '../decorators';
import { HttpArgs } from '../helpers/route.helper';

@Controller
export class UserController {
    @GetRequest('/user')
    static async getUsers({ repo }: HttpArgs): Promise<User[]> {
        return repo(User).find({});
    }

    @GetRequest('/user/me')
    static async getCurrentUser({ currentUser }: HttpArgs): Promise<User> {
        return currentUser;
    }

    @PostRequest('/user/signin')
    @Unauthenticated()
    static async signin({ body, repo }: HttpArgs): Promise<string> {
        const { username, password } = body;

        const user = await repo(User).findOne({
            where: { username },
            select: ['id', 'passwordHash', 'username'],
        });

        if (!user) throw Boom.notFound('User not found');

        if (await UserHelper.comparePasswords(password, user.passwordHash)) {
            const jwt = UserHelper.generateJWT(user.id);
            return jwt;
        }

        throw Boom.unauthorized('Failed to sign in as user');
    }
}
