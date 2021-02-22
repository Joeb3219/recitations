import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DateRangeOverride, MeetingOverride, UserOverride } from '../interfaces';
import { GradebookOverride } from './gradebookOverride';
import { MeetingTime } from './meetingTime';
import { User } from './user';

@Entity()
export class GradebookDateRangeOverride extends BaseEntity implements DateRangeOverride {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'timestamp' })
    @Type(() => Date)
    start: Date;

    @Column({ type: 'timestamp' })
    @Type(() => Date)
    end: Date;

    @ManyToOne(type => GradebookOverride, override => override.dateRangeOverrides)
    @JoinColumn()
    @Type(() => GradebookOverride)
    public override: GradebookOverride;

    constructor(args: Partial<GradebookDateRangeOverride> = {}) {
        super();
        Object.assign(this, args);
    }
}

@Entity()
export class GradebookMeetingOverride extends BaseEntity implements MeetingOverride {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'timestamp' })
    @Type(() => Date)
    date: Date;

    @ManyToOne(() => MeetingTime, { eager: true })
    @JoinTable()
    @Type(() => MeetingTime)
    meetingTime: MeetingTime;

    @ManyToOne(type => GradebookOverride, override => override.dateRangeOverrides)
    @JoinColumn()
    @Type(() => GradebookOverride)
    public override: GradebookOverride;

    constructor(args: Partial<GradebookMeetingOverride> = {}) {
        super();
        Object.assign(this, args);
    }
}

@Entity()
export class GradebookUserOverride extends BaseEntity implements UserOverride {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'timestamp' })
    @Type(() => Date)
    date: Date;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn()
    @Type(() => User)
    user: User;

    @ManyToOne(() => MeetingTime, { eager: true })
    @JoinTable()
    @Type(() => MeetingTime)
    meetingTime: MeetingTime;

    @ManyToOne(type => GradebookOverride, override => override.dateRangeOverrides)
    @JoinColumn()
    @Type(() => GradebookOverride)
    public override: GradebookOverride;

    constructor(args: Partial<GradebookUserOverride> = {}) {
        super();
        Object.assign(this, args);
    }
}
