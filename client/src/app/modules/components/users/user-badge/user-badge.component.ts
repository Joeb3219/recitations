import { Component, Input } from '@angular/core';
import { User } from '@models/user';

@Component({
    selector: 'app-user-badge',
    templateUrl: './user-badge.component.html',
    styleUrls: ['./user-badge.component.scss'],
})
export class UserBadgeComponent {
    @Input() user?: User = undefined;
}
