import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbilityDef, AbilityManager } from '@dynrec/common';
import { faEllipsisV, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@services/user.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
    selector: 'app-roles-formfield',
    templateUrl: './roles-formfield.component.html',
    styleUrls: ['./roles-formfield.component.scss'],
})
export class RolesFormfieldComponent implements OnInit {
    @Input() abilities: string[];
    @Input() name?: string;

    @Output() onChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    icons = {
        add: faPlusSquare,
        modify: faEllipsisV,
    };

    currentlySelectedAbility?: AbilityDef = undefined;

    allAbilities: AbilityDef[] = [];

    constructor(private readonly userService: UserService) {}

    ngOnInit() {
        if (!this.abilities) {
            this.abilities = [];
        }

        this.loadAbilities();
    }

    async loadAbilities() {
        this.allAbilities = AbilityManager.getAllAbilities(undefined);
    }

    formatter = (ability?: AbilityDef): string => {
        return ability?.name ?? ``;
    };

    handleAbilitySelected(data: { item: AbilityDef }): void {
        const foundMatch = this.abilities?.find(ability => ability === data.item.id);

        if (!foundMatch) {
            this.abilities = [...(this.abilities ?? []), data.item.id];
            this.onChange.emit(this.abilities);
            this.currentlySelectedAbility = undefined;
        }
    }

    handleAbilityDeleted(item: AbilityDef) {
        this.abilities = this.abilities?.filter(ability => ability !== item.id);
        this.onChange.emit(this.abilities ?? []);
    }

    search = (text$: Observable<string>): Observable<AbilityDef[]> =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term =>
                term === ''
                    ? ([] as AbilityDef[])
                    : this.allAbilities
                          .filter(ability => {
                              return ability.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
                          })
                          .slice(0, 10)
            )
        );
}
