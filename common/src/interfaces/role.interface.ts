import { CourseInterface } from './course.interface';
import { UserInterface } from './user.interface';

export interface RoleInterface {
    id: string;
    name: string;
    course?: CourseInterface;

    creator?: UserInterface;

    abilities: string[];
}
