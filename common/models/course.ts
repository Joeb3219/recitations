import { CourseInterface } from '@interfaces/course.interface';
import { Section } from '@models/section';
import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Course extends BaseEntity implements CourseInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public name: string;

    @Column()
    public department: string;

    @Column()
    public courseCode: string;

    @OneToMany((type) => Section, (section) => section.course, {
        cascade: true,
    })
    @JoinTable()
    public sections?: Section[];

    constructor(
        args: {
            id?: string;
            name?: string;
            department?: string;
            courseCode?: string;
            sections?: Section[];
        } = {}
    ) {
        super();
        Object.assign(this, args);
    }
}
