import { Component, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Course, Role, StandardResponseInterface } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { RoleService } from '@services/role.service';
import { LoadedArg } from '../../../../decorators';
import { HttpFilterInterface } from '../../../../http/httpFilter.interface';
import { DatatableColumn } from '../../../components/datatable/datatable.component';

@Component({
    selector: 'app-list-roles',
    templateUrl: './list-roles.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list-roles.component.scss'],
})
export class ListRolesComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    refreshData: EventEmitter<void> = new EventEmitter();

    columns: DatatableColumn<Role>[] = [
        {
            name: 'Name',
            prop: 'name',
        },
        {
            name: 'Creator',
            prop: 'creator',
            cellTemplate: 'userCell',
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: Role) => [
                {
                    text: 'View',
                    href: `/courses/${row.course?.id}/roles/${row.id}`,
                },
                {
                    text: 'Modify',
                    click: () => this.handleOpenEditRoleModal(row),
                },
                // {
                //     text: 'Delete',
                //     click: () => this.handleOpenDeleteRoleModal(row),
                // },
            ],
        },
    ];

    selectedEditRole?: Role = undefined;
    selectedDeleteRole?: Role = undefined;

    isEditRoleModalOpen = false;
    isDeleteRoleModalOpen = false;

    constructor(private roleService: RoleService) {
        this.fetchRoles = this.fetchRoles.bind(this);
    }

    async fetchRoles(args: HttpFilterInterface): Promise<StandardResponseInterface<Role[]>> {
        return this.roleService.getCourseRoles(this.course, args);
    }

    handleOpenNewRoleModal(): void {
        this.isEditRoleModalOpen = true;

        this.selectedEditRole = new Role();
        this.selectedEditRole.course = this.course;
    }

    handleCloseEditRoleModal(): void {
        this.isEditRoleModalOpen = false;

        this.selectedEditRole = undefined;

        this.refreshData.emit();
    }

    handleOpenEditRoleModal(role: Role): void {
        this.isEditRoleModalOpen = true;
        this.selectedEditRole = role;
    }

    handleOpenDeleteRoleModal(role: Role): void {
        this.isDeleteRoleModalOpen = true;
        this.selectedDeleteRole = role;
    }

    handleCloseDeleteRoleModal(): void {
        this.isDeleteRoleModalOpen = false;
        this.refreshData.emit();
    }
}
