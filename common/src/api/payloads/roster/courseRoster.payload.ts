import { Type } from 'class-transformer';
import { Section, User } from '../../../models/index';

export class CourseRosterPayload {
    @Type(() => User)
    student: User;
    @Type(() => Section)
    section: Section;
}
