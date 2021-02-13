import { Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingReportInterface, ProblemFeedbackInterface } from '../interfaces/meetingReport.interface';
import { Course, MeetingTime, User } from '../models/index';

@Entity()
export class MeetingReport extends BaseEntity implements MeetingReportInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column()
    feedback: string;

    @ManyToMany(() => User, { eager: true })
    @JoinTable()
    studentsPresent: User[];

    @Column({ type: 'jsonb' })
    problemFeedback: ProblemFeedbackInterface[];

    @ManyToMany(() => MeetingTime, { eager: true, nullable: true })
    @JoinTable()
    @Type(() => MeetingTime)
    public meetingTimes: MeetingTime[];

    @ManyToOne(() => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    @Type(() => User)
    public creator: User;

    constructor(args: Partial<MeetingReport> = {}) {
        super();
        Object.assign(this, args);
    }
}
