import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Role, StandardResponseInterface } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
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
}
