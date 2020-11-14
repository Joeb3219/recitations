import { Component, OnInit } from '@angular/core';
import { User } from '@dynrec/common';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    user?: User = undefined;

    constructor(private userService: UserService) {}

    async ngOnInit(): Promise<void> {
        this.userService.getCurrentUser().subscribe({
            next: (currentUser) => {
                this.user = currentUser;
            },
        });
    }
}
