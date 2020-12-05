import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LessonPlanInterface } from '../interfaces';
import { Course, LessonPlanStep, User } from '../models';

@Entity()
export class LessonPlan extends BaseEntity implements LessonPlanInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public name: string;

    @OneToMany(type => LessonPlanStep, step => step.lessonPlan, {
        eager: true,
    })
    @JoinColumn()
    @Type(() => LessonPlanStep)
    public steps: LessonPlanStep[];

    @ManyToOne(type => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    @ManyToOne(type => User, { eager: true, cascade: true })
    @JoinColumn()
    @Type(() => User)
    public creator?: User;

    constructor(args: Partial<LessonPlan> = {}) {
        super();
        Object.assign(this, args);
    }

    public getDuration(): number {
        return (this.steps || []).reduce((total, curr) => {
            return total;
        }, 0);
    }
}
