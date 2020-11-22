import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@dynrec/common';
import { UserService } from '@services/user.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
    selector: 'app-user-search-formfield',
    templateUrl: './user-search-formfield.component.html',
    styleUrls: ['./user-search-formfield.component.scss'],
})
export class UserSearchFormfieldComponent implements OnInit {
    @Input() user?: User = undefined;

    @Input() name?: string = undefined;

    @Output() onChange: EventEmitter<User> = new EventEmitter<User>();

    users: User[];

    constructor(private userService: UserService) {}

    async ngOnInit(): Promise<void> {
        this.users = await this.userService.getUsers();
    }

    formatter = (user: User): string => {
        if (user) return `${user.firstName} ${user.lastName} (${user.username}, ${user.email})`;
        return ``;
    };

    handleUserSelected(data: { item: User }): void {
        this.onChange.emit(data.item);
    }

    search = (text$: Observable<string>): Observable<User[]> =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term =>
                term === ''
                    ? []
                    : this.users
                          .filter(user => {
                              return (
                                  user.firstName.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                                  user.lastName.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                                  user.email.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                                  user.username.toLowerCase().indexOf(term.toLowerCase()) > -1
                              );
                          })
                          .slice(0, 10)
            )
        );
}
