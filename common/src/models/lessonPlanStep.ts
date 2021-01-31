import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LessonPlanStepInterface } from '../interfaces';
import { Course, Problem, User } from '../models';
import { LessonPlan } from './lessonPlan';

export type LessonPlanStepType = 'problem' | 'task';

@Entity()
export class LessonPlanStep extends BaseEntity implements LessonPlanStepInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public type?: LessonPlanStepType;

    @Column()
    public title?: string;

    @Column()
    public description?: string;

    @Column()
    public estimatedDuration?: number;

    @ManyToOne(type => Problem, { eager: true })
    @Type(() => Problem)
    public problem?: Problem;

    @ManyToOne(type => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    @ManyToOne(type => LessonPlan, lessonPlan => lessonPlan.steps)
    @JoinColumn()
    @Type(() => LessonPlan)
    public lessonPlan: LessonPlan;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    @Type(() => User)
    public creator?: User;

    constructor(args: Partial<LessonPlanStep> = {}) {
        super();
        Object.assign(this, args);
    }
}
