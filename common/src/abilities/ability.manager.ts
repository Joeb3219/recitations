import _ from 'lodash';
import { User } from '../models';
import { Ability, ABILITY_GENERATORS } from './ability.definition';

export class AbilityManager {
    static getAllAbilities(user?: User) {
        return _.flatten(
            ABILITY_GENERATORS.map(ability => ({
                id: ability.id,
                name: ability.name,
                actions: ability.actions(user),
            }))
        );
    }

    static getUserAbilities(user?: User): Ability {
        if (!user) {
            return new Ability([]);
        }

        // Load all of the abilities, regardless of the user's actual permissions
        const allAbilities = ABILITY_GENERATORS;
        const keyedAbilities = _.keyBy(allAbilities, ability => ability.id);

        // And now we can restrict down.
        const abilities = user.roles.map(role =>
            role.abilities.map(abilityId =>
                keyedAbilities[abilityId] ? keyedAbilities[abilityId].actions(user, role.course) : []
            )
        );

        return new Ability(_.uniq(_.flattenDeep(abilities)));
    }
}
