import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbilityDef, AbilityManager } from '@dynrec/common';
import { faEllipsisV, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@services/user.service';

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

    allAbilities: AbilityDef[] = [];

    constructor(private readonly userService: UserService) {}

    ngOnInit() {
        if (!this.abilities) {
            this.abilities = [];
        }

        this.loadAbilities();
    }

    async loadAbilities() {
        this.allAbilities = AbilityManager.getAllAbilities(undefined).filter(role => !role.isGlobal);
    }

    handleAbilityToggled(item: AbilityDef): void {
        const foundMatch = this.abilities?.find(ability => ability === item.id);

        if (!foundMatch) {
            this.abilities = [...(this.abilities ?? []), item.id];
            this.onChange.emit(this.abilities);
        } else {
            this.abilities = (this.abilities ?? []).filter(ability => ability !== item.id);
            this.onChange.emit(this.abilities);
        }
    }
}
