import { MeetableInterface } from '@interfaces/meetable.interface';
import { MeetingTime } from '@models/meetingTime';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    TableInheritance,
} from 'typeorm';
import { Meetable } from './meetable';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Meeting extends BaseEntity implements MeetableInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ManyToOne(() => MeetingTime, { eager: true })
    meetingTime: MeetingTime;

    @ManyToOne(() => Meetable, { eager: true })
    meetable: Meetable;

    @Column()
    number: number;

    @Column(() => Date)
    date: Date;

    constructor(args: Partial<Meeting> = {}) {
        super();
        Object.assign(this, args);
    }
}
