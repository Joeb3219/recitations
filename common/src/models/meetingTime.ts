import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingType } from '../enums';
import { MeetingTimeInterface } from '../interfaces';
import { Meetable, User } from '../models';

@Entity()
export class MeetingTime extends BaseEntity implements MeetingTimeInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        type: 'time',
    })
    public startTime: string;

    @Column({
        type: 'time',
    })
    public endTime: string;

    @Column()
    public weekday: string;

    @ManyToOne((type) => User, { eager: true })
    @JoinTable()
    public leader?: User;

    @Column({
        type: 'enum',
        enum: MeetingType,
        default: MeetingType.RECITATION,
    })
    public type: MeetingType;

    @Column()
    public frequency: number;

    @ManyToOne((type) => Meetable, (meetable) => meetable.meetingTimes)
    @JoinTable()
    public meetable: Meetable;

    constructor(args: Partial<MeetingTime> = {}) {
        super();
        Object.assign(this, args);
    }
}
