import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonPlanStepInterface } from '../interfaces';
import { Course, Problem, User } from '../models';
import { LessonPlan } from './lessonPlan';

export type LessonPlanStepType = 'problem' | 'task';

@Entity()
export class LessonPlanStep
    extends BaseEntity
    implements LessonPlanStepInterface {
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

    @ManyToOne((type) => Problem, { eager: true })
    public problem?: Problem;

    @ManyToOne((type) => Course, { eager: true })
    @JoinColumn()
    public course: Course;

    @ManyToOne((type) => LessonPlan, (lessonPlan) => lessonPlan.steps)
    @JoinTable()
    public lessonPlan: LessonPlan;

    @ManyToOne((type) => User, { eager: true, cascade: true })
    @JoinColumn()
    public creator?: User;

    constructor(args: Partial<LessonPlanStep> = {}) {
        super();
        Object.assign(this, args);
    }
}
