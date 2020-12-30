import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultCourseSettings } from '../constants';
import { CourseInterface, CourseSetting, CourseSettingKey, CourseSettings } from '../interfaces';
import { CourseSemesterDescriptor } from '../interfaces/course.interface';
import { Section } from '../models';

@Entity()
export class Course extends BaseEntity implements CourseInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public name: string;

    @Column()
    public department: string;

    @Column()
    public courseCode: string;

    @OneToMany(type => Section, section => section.course, {
        cascade: true,
    })
    @JoinColumn()
    @Type(() => Section)
    public sections?: Section[];

    @Column({ type: 'jsonb', nullable: true })
    public settings?: CourseSettings;

    @Column({ type: 'jsonb', default: { term: 'Fall', year: '1900' } })
    public semester: CourseSemesterDescriptor;

    getMergedSettings(): CourseSettings {
        return Object.assign(
            {},
            ...(Object.keys(DefaultCourseSettings) as CourseSettingKey[]).map((key: CourseSettingKey) => ({
                [key]: {
                    ...DefaultCourseSettings[key],
                    value: this.settings?.[key].value ?? DefaultCourseSettings[key].value,
                },
            }))
        );
    }

    getSetting(settingKey: CourseSettingKey): CourseSetting {
        const settings = this.getMergedSettings();
        return settings[settingKey];
    }

    constructor(args: Partial<Course> = {}) {
        super();
        Object.assign(this, args);
    }
}
