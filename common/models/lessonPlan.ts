import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    JoinColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';

import { LessonPlanInterface } from '@interfaces/lessonPlan.interface';
import { User } from '@models/user';
import { Course } from '@models/course';

import { LessonPlanStep } from '@models/lessonPlanStep';

@Entity()
export class LessonPlan extends BaseEntity implements LessonPlanInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public name: string;

    @OneToMany((type) => LessonPlanStep, (step) => step.lessonPlan, {
        eager: true,
    })
    @JoinColumn()
    public steps: LessonPlanStep[];

    @ManyToOne((type) => Course, { eager: true })
    @JoinColumn()
    public course: Course;

    @ManyToOne((type) => User, { eager: true, cascade: true })
    @JoinColumn()
    public creator?: User;

    constructor(
        args: {
            id?: string;
            name?: number;
            steps?: LessonPlanStep[];
            creator?: User;
            course?: Course;
        } = {}
    ) {
        super();
        Object.assign(this, args);
    }

    public getDuration(): number {
        return (this.steps || []).reduce((total, curr) => {
            return total;
        }, 0);
    }
}
