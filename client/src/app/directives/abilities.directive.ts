import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Ability, AbilityManager, RuleAction, User } from '@dynrec/common';
import { UserService } from '@services/user.service';
import _ from 'lodash';

export type AbilitiesCanDirectivePayload = { action: RuleAction; subject: unknown | string };

@Directive({
    selector: '[can]',
})
export class AbilitiesDirective {
    private ability?: Ability;
    private canPayload: AbilitiesCanDirectivePayload[];

    @Input()
    set can(value: AbilitiesCanDirectivePayload | AbilitiesCanDirectivePayload[]) {
        this.canPayload = Array.isArray(value) ? value : [value];
    }

    constructor(
        private element: ElementRef,
        private templateref: TemplateRef<unknown>,
        private viewContainer: ViewContainerRef,
        private readonly userService: UserService
    ) {}

    ngOnInit() {
        this.userService.getCurrentUser().subscribe({
            next: user => {
                this.viewContainer.clear();
                this.loadAbilities(user);
                this.render();
            },
        });
    }

    loadAbilities(user?: User) {
        this.ability = AbilityManager.getUserAbilities(user);
    }

    verify(): boolean {
        if (!this.ability || !this.canPayload) {
            return false;
        }

        return _.every(this.canPayload.map(payload => this.ability?.can(payload.action, payload.subject)));
    }

    render() {
        if (this.verify()) this.viewContainer.createEmbeddedView(this.templateref);
        else this.viewContainer.clear();
    }
}
