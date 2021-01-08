import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LessonInterface } from '../interfaces/lesson.interface';
import { Course, LessonPlan, MeetingTime } from '../models/index';
import { Quiz } from './quiz';

@Entity()
export class Lesson extends BaseEntity implements LessonInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'timestamp' })
    beginDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @ManyToOne(() => LessonPlan, { eager: true })
    @JoinColumn()
    @Type(() => LessonPlan)
    public lessonPlan: LessonPlan;

    @ManyToOne(() => Quiz, { eager: true, nullable: true })
    @JoinColumn()
    @Type(() => Quiz)
    public quiz?: Quiz | null;

    @ManyToOne(() => MeetingTime, { eager: true, nullable: true })
    @JoinColumn()
    @Type(() => MeetingTime)
    public meetingTime?: MeetingTime | null;

    @ManyToOne(() => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    constructor(args: Partial<Lesson> = {}) {
        super();
        Object.assign(this, args);
    }
}
