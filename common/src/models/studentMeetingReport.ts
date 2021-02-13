import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
    QuizElementAnswerInterface,
    StudentMeetingReportInterface,
} from '../interfaces/studentMeetingReport.interface';
import { Course, MeetingTime, Quiz, User } from '../models/index';

@Entity()
export class StudentMeetingReport extends BaseEntity implements StudentMeetingReportInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'jsonb' })
    answers: QuizElementAnswerInterface[];

    @ManyToOne(() => MeetingTime, { eager: true, nullable: true })
    @JoinColumn()
    @Type(() => MeetingTime)
    public meetingTime: MeetingTime;

    @ManyToOne(() => Quiz, { eager: true, nullable: true })
    @JoinColumn()
    @Type(() => Quiz)
    public quiz: Quiz;

    @ManyToOne(() => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    @Type(() => User)
    public creator: User;

    constructor(args: Partial<StudentMeetingReport> = {}) {
        super();
        Object.assign(this, args);
    }
}
