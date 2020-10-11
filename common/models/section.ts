import { SectionInterface } from '@interfaces/section.interface';
import { Course } from '@models/course';
import { Meetable } from '@models/meetable';
import { User } from '@models/user';
import {
    ChildEntity,
    Column,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ChildEntity()
export class Section extends Meetable implements SectionInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public index: string;

    @Column()
    public sectionNumber: string;

    @ManyToOne((type) => Course, (course) => course.sections, { eager: true })
    @JoinColumn()
    public course: Course;

    @ManyToOne((type) => User, { eager: true, cascade: true })
    @JoinColumn()
    public ta?: User;

    @ManyToOne((type) => User, { eager: true, cascade: true })
    @JoinColumn()
    public instructor?: User;

    @ManyToMany((type) => User)
    @JoinTable()
    public students?: User[];

    constructor(
        args: {
            id?: string;
            index?: string;
            sectionNumber?: string;
            course?: Course;
            students?: User[];
            ta?: User;
            instructor?: User;
        } = {}
    ) {
        super();
        Object.assign(this, args);
    }
}
