import { Type } from 'class-transformer';
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
    @Type(() => Course)
    public course: Course;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    @Type(() => User)
    public ta?: User;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    @Type(() => User)
    public instructor?: User;

    @ManyToMany(type => User, { eager: true })
    @JoinTable()
    @Type(() => User)
    public students?: User[];

    get meetingIdentifier() {
        return this.sectionNumber;
    }

    constructor(args: Partial<Section> = {}) {
        super();
        Object.assign(this, args);
    }
}
