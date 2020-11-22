import dayjs from 'dayjs';
import { BaseEntity, Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MeetingType } from '../enums';
import { MeetingTimeInterface } from '../interfaces';
import { Meetable, User } from '../models';

export type Weekdays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

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
    public weekday: Weekdays;

    @ManyToOne(() => User, { eager: true })
    @JoinTable()
    public leader?: User;

    @Column({
        type: 'varchar',
        default: MeetingType.RECITATION,
    })
    public type: MeetingType;

    @Column()
    public frequency: number;

    @ManyToOne(type => Meetable, meetable => meetable.meetingTimes)
    @JoinTable()
    public meetable: Meetable;

    get numericWeekday(): number {
        switch (this.weekday) {
            case 'monday':
                return 1;
            case 'tuesday':
                return 2;
            case 'wednesday':
                return 3;
            case 'thursday':
                return 4;
            case 'friday':
                return 5;
            case 'saturday':
                return 6;
            case 'sunday':
                return 0;
            default:
                return -1;
        }
    }

    // Returns true if this meetingtime can occur on the provided date.
    canOccurOnDate(date: Date): boolean {
        return this.getStartTime(date).getDay() === this.numericWeekday;
    }

    getStartTime(date: Date): Date {
        const baseDate = dayjs(date).startOf('day');
        return dayjs(`${baseDate.format('YYYY/MM/DD')} ${this.startTime}`).toDate();
    }

    constructor(args: Partial<MeetingTime> = {}) {
        super();
        Object.assign(this, args);
    }
}
