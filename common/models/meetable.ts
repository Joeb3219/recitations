import { MeetableInterface } from '@interfaces/meetable.interface';
import { MeetingTime } from '@models/meetingTime';
import {
    BaseEntity,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Meetable extends BaseEntity implements MeetableInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @OneToMany((type) => MeetingTime, (meetingTime) => meetingTime.meetable, {
        eager: true,
        cascade: true,
    })
    @JoinTable()
    public meetingTimes?: MeetingTime[];

    constructor(args: Partial<Meetable> = {}) {
        super();
        Object.assign(this, args);
    }
}
