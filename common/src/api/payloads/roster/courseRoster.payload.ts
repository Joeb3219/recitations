import { Type } from 'class-transformer';
import { Section, User } from '../../../models/index';

export class CourseRosterPayload {
    // this field is unused, and is only around to prevent frontend errors
    id?: string | undefined;

    @Type(() => User)
    student: User;
    @Type(() => Section)
    section: Section;
}
