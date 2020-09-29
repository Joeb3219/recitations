import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    JoinTable,
} from 'typeorm';

import { CourseInterface } from '@interfaces/course.interface';

import { Section } from '@models/section';

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
        eager: true,
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
