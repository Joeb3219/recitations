import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@dynrec/common';
import _ from 'lodash';

@Component({
    selector: 'app-roster-formfield',
    templateUrl: './roster-formfield.component.html',
    styleUrls: ['./roster-formfield.component.scss'],
})
export class RosterFormfieldComponent implements OnInit {
    @Input() users: User[] = [];
    @Input() value: User[] = [];

    @Output() onChange: EventEmitter<User[]> = new EventEmitter<User[]>();

    attendingIds: { [K: string]: boolean } = {};

    ngOnInit(): void {
        this.attendingIds = Object.assign(
            {},
            ...this.users.map(user => ({ [user.id]: this.value.find(vUser => user.id === vUser.id) !== undefined }))
        );
    }

    handleUserToggled(user: User, present: boolean) {
        this.attendingIds[user.id] = present;
        this.value = _.compact(
            Object.keys(this.attendingIds)
                .filter(id => !!this.attendingIds[id])
                .map(id => this.users.find(user => user.id === id))
        );
        this.onChange.emit(this.value);
    }
}
