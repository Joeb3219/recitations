import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course, User } from '@dynrec/common';

@Component({
    selector: 'app-users-multi-formfield',
    templateUrl: './users-multi-formfield.component.html',
    styleUrls: ['./users-multi-formfield.component.scss'],
})
export class UsersMultiFormfieldComponent implements OnInit {
    @Input() users?: User[] = [];
    @Input() course: Course;
    @Input() name?: string;

    @Output() onChange: EventEmitter<User[]> = new EventEmitter<User[]>();

    currentlySelectedUser?: User = undefined;

    ngOnInit() {
        if (!this.users) {
            this.users = [];
        }
    }

    handleUserSelected(user: User): void {
        const foundMatch = this.users?.find(rUser => rUser.id === user.id);

        if (!foundMatch) {
            this.users = [...(this.users ?? []), user];
            this.onChange.emit(this.users);
            this.currentlySelectedUser = undefined;
        }
    }

    handleUserDeleted(user: User) {
        this.users = this.users?.filter(rUser => rUser.id !== user.id);
        this.onChange.emit(this.users ?? []);
    }
}
