import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Role, StandardResponseInterface, User } from '@dynrec/common';
import { environment } from '@environment';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { plainToClass } from 'class-transformer';
import { DeleteRequest, GetRequest, ListRequest, UpsertRequest } from '../decorators';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<Role>(Role)
    public async upsertRole(role: Role): Promise<StandardResponseInterface<Role>> {
        throw new Error('Decorator Overloading Failed');
    }

    @ListRequest<Role>(Role)
    public async getCourseRoles(
        course: Course,
        filter?: HttpFilterInterface
    ): Promise<StandardResponseInterface<Role[]>> {
        throw new Error('Decorator Overloading Failed');
    }

    @GetRequest<Role>(Role)
    public async getRole(roleID: string): Promise<StandardResponseInterface<Role>> {
        throw new Error('Decorator Overloading Failed');
    }

    @DeleteRequest<Role>(Role)
    public async deleteRole(roleID: string): Promise<StandardResponseInterface<void>> {
        throw new Error('Decorator Overloading Failed');
    }

    public async getRoleAssignments(role: Role): Promise<StandardResponseInterface<User[]>> {
        const url = `${environment.apiURL}/role/${role.id}/assignments`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<User[]>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = result.data.map(user => plainToClass(User, user));
                        resolve(result);
                    } else reject(new Error('No result returned'));
                },
                (err: Error) => {
                    reject(err);
                }
            );
        });
    }

    public async updateRoleAssignments(role: Role, users: User[]): Promise<StandardResponseInterface<User[]>> {
        const url = `${environment.apiURL}/role/${role.id}/assignments`;
        return new Promise((resolve, reject) => {
            this.http
                .post<StandardResponseInterface<User[]>>(url, { userIds: users.map(user => user.id) })
                .subscribe(
                    result => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = result.data.map(user => plainToClass(User, user));
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
        });
    }
}
