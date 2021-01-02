import { RuleTag } from '../abilities/ability.definition';
import { CourseInterface } from './course.interface';
import { UserInterface } from './user.interface';

export interface RoleInterface {
    id: string;
    name: string;
    course?: CourseInterface;
    ruleTag?: RuleTag;

    creator?: UserInterface;

    abilities: string[];
}
