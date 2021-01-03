import { User } from '@dynrec/common';
import * as Boom from '@hapi/boom';
import _ from 'lodash';
import { Controller, GetRequest, PostRequest, Unauthenticated } from '../decorators';
import { PutRequest } from '../decorators/request.decorator';
import { HttpArgs } from '../helpers/route.helper';
import { UserHelper } from '../helpers/user.helper';

@Controller
export class UserController {
    @GetRequest('/user')
    async getUsers(): Promise<User[]> {
        return User.find({});
    }

    @GetRequest('/user/me')
    async getCurrentUser({ currentUser }: HttpArgs<User>): Promise<User> {
        return currentUser;
    }

    @PostRequest('/user/signin')
    @Unauthenticated()
    async signin({ body }: HttpArgs<{ username: string; password: string }>): Promise<string> {
        const { username, password } = body;

        if (!password) throw Boom.badRequest('No password provided');

        const user = await User.findOne({
            where: { username },
            select: ['id', 'passwordHash', 'username'],
        });

        if (!user) throw Boom.notFound('User not found');

        if (!user.passwordHash) {
            throw Boom.badRequest('Password login disabled');
        }

        if (await UserHelper.comparePasswords(password, user.passwordHash)) {
            const jwt = UserHelper.generateJWT(user.id);
            return jwt;
        }

        throw Boom.unauthorized('Failed to sign in as user');
    }

    @PostRequest('/user/impersonate')
    async impersonateUser({ ability, body }: HttpArgs<{ username: string }>): Promise<string> {
        const { username } = body;

        if (!ability.can('use', 'impersonate_users')) {
            throw Boom.unauthorized('Unauthorized to impersonate users');
        }

        const user = await User.findOne({
            where: { username },
            select: ['id', 'username'],
        });

        if (!user) throw Boom.notFound('User not found');

        const jwt = UserHelper.generateJWT(user.id);
        return jwt;
    }

    @PostRequest('/user/me')
    async updateUser({ body, currentUser }: HttpArgs<{ user: User }>): Promise<User> {
        const { user } = body;

        if (!user || currentUser.id !== user.id) {
            throw Boom.badRequest('Attempting to edit a different user');
        }

        const updateableData = _.pickBy(
            { firstName: user.firstName, lastName: user.lastName, email: user.email },
            item => {
                return item !== undefined;
            }
        );

        const updatedUser = Object.assign({}, currentUser, user);

        return User.save(updatedUser);
    }

    @PutRequest('/user')
    async createUser({ ability, body }: HttpArgs<{ user: User }>): Promise<User> {
        const { user } = body;

        if (!ability.can('create', new User(user))) {
            throw Boom.unauthorized('Unauthorized to create users.');
        }

        return User.save(user as User);
    }
}
