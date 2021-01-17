import { Component, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
export class ListRolesComponent implements OnChanges {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    refreshData: EventEmitter<void> = new EventEmitter();

    columns: DatatableColumn<Role>[] = [
        {
            name: 'Name',
            prop: 'name',
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: Role) => [
                ...(!row.ruleTag
                    ? [
                          {
                              text: 'Modify',
                              click: () => this.handleOpenEditRoleModal(row),
                          },
                      ]
                    : []),
                ...(!row.ruleTag
                    ? [
                          {
                              text: 'Assign Users',
                              click: () => this.handleOpenAssignUsersModal(row),
                          },
                      ]
                    : []),
            ],
        },
    ];

    selectedEditRole?: Role = undefined;
    selectedDeleteRole?: Role = undefined;

    isEditRoleModalOpen = false;
    isAssignUsersModalOpen = false;
    isDeleteRoleModalOpen = false;

    constructor(private roleService: RoleService) {
        this.fetchRoles = this.fetchRoles.bind(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.refreshData.next();
        }
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

    handleCloseAssignUsersModal(): void {
        this.isAssignUsersModalOpen = false;

        this.selectedEditRole = undefined;

        this.refreshData.emit();
    }

    handleOpenEditRoleModal(role: Role): void {
        this.isEditRoleModalOpen = true;
        this.selectedEditRole = role;
    }

    handleOpenAssignUsersModal(role: Role) {
        this.isAssignUsersModalOpen = true;
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
