import { Directive, ElementRef, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Ability, AbilityManager, Course, RuleAction, User } from '@dynrec/common';
import { UserService } from '@services/user.service';
import _ from 'lodash';

export type AbilitiesCanDirectivePayload = {
    action: RuleAction;
    subject: unknown | string;
    existsOnCourse?: Course;
};

@Directive({
    selector: '[can]',
})
export class AbilitiesDirective implements OnChanges {
    private ability?: Ability;
    private canPayload?: AbilitiesCanDirectivePayload[];

    @Input()
    set can(value: AbilitiesCanDirectivePayload | AbilitiesCanDirectivePayload[] | undefined) {
        if (!value) {
            return;
        }

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

    ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            this.viewContainer.clear();
            this.render();
        }
    }

    loadAbilities(user?: User) {
        this.ability = AbilityManager.getUserAbilities(user);
    }

    verify(): boolean {
        if (!this.ability || !this.canPayload) {
            return false;
        }

        return _.every(
            this.canPayload.map(payload =>
                payload.existsOnCourse
                    ? this.ability?.existsOnCourse(payload.action, payload.subject, payload.existsOnCourse)
                    : this.ability?.can(payload.action, payload.subject)
            )
        );
    }

    render() {
        if (!this.canPayload || !this.canPayload.length || this.verify())
            this.viewContainer.createEmbeddedView(this.templateref);
        else this.viewContainer.clear();
    }
}
