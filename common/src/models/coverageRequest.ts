import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CoverageRequestInterface } from '../interfaces/coverageRequest.interface';
import { Course } from './course';
import { MeetingTime } from './meetingTime';
import { User } from './user';

@Entity()
@Unique('meeting_date', ['meetingTime', 'date'])
export class CoverageRequest extends BaseEntity implements CoverageRequestInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'timestamp' })
    public date: Date;

    @Column({ type: 'varchar' })
    public reason: string;

    @ManyToOne(() => MeetingTime, { eager: true })
    @JoinColumn()
    @Type(() => MeetingTime)
    public meetingTime: MeetingTime;

    @ManyToOne(() => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    @ManyToOne(() => User, { eager: true, cascade: true, nullable: true })
    @JoinColumn()
    @Type(() => User)
    public coveredBy?: User | null;

    constructor(args: Partial<CoverageRequest> = {}) {
        super();
        Object.assign(this, args);
    }
}
