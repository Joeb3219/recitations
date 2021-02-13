/* eslint-disable no-use-before-define */
import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GradebookOverrideInterface } from '../interfaces/gradebookOverride.interface';
import { Course } from './course';
import { GradebookDateRangeOverride, GradebookMeetingOverride, GradebookUserOverride } from './gradebookOverrideData';
import { User } from './user';

@Entity()
export class GradebookOverride extends BaseEntity implements GradebookOverrideInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @OneToMany(() => GradebookDateRangeOverride, override => override.override, { cascade: true, eager: true })
    @JoinColumn()
    @Type(() => GradebookDateRangeOverride)
    dateRangeOverrides: GradebookDateRangeOverride[];

    @OneToMany(() => GradebookUserOverride, override => override.override, { cascade: true, eager: true })
    @JoinColumn()
    @Type(() => GradebookUserOverride)
    userOverrides: GradebookUserOverride[];

    @OneToMany(() => GradebookMeetingOverride, override => override.override, { cascade: true, eager: true })
    @JoinColumn()
    @Type(() => GradebookMeetingOverride)
    meetingOverrides: GradebookMeetingOverride[];

    @Column({ type: 'varchar' })
    @Type(() => String)
    reason: string;

    @Column({ type: 'boolean', nullable: true })
    @Type(() => Boolean)
    overrideAttendance?: boolean;

    @Column({ type: 'boolean', nullable: true })
    @Type(() => Boolean)
    overrideQuiz?: boolean;

    @ManyToOne(() => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn()
    @Type(() => User)
    public creator: User;

    constructor(args: Partial<GradebookOverride> = {}) {
        super();
        Object.assign(this, args);
    }
}
