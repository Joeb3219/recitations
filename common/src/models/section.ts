import { ChildEntity, Column, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SectionInterface } from '../interfaces';
import { Course, Meetable, User } from '../models';

@ChildEntity()
export class Section extends Meetable implements SectionInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public index: string;

    @Column()
    public sectionNumber: string;

    @ManyToOne(type => Course, course => course.sections, { eager: true })
    @JoinColumn()
    public course: Course;

    @ManyToOne(type => User, { eager: true, cascade: true })
    @JoinColumn()
    public ta?: User;

    @ManyToOne(type => User, { eager: true, cascade: true })
    @JoinColumn()
    public instructor?: User;

    @ManyToMany(type => User)
    @JoinTable()
    public students?: User[];

    constructor(args: Partial<Section> = {}) {
        super();
        Object.assign(this, args);
    }
}
