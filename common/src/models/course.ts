import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultCourseSettings } from '../constants';
import {
    CourseInterface,
    CourseSettingKey,
    CourseSettings,
} from '../interfaces';
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

    @OneToMany((type) => Section, (section) => section.course, {
        cascade: true,
    })
    @JoinTable()
    public sections?: Section[];

    @Column({ type: 'jsonb', nullable: true })
    public settings?: CourseSettings;

    getMergedSettings(): CourseSettings {
        return Object.assign(
            {},
            ...(Object.keys(DefaultCourseSettings) as CourseSettingKey[]).map(
                (key: CourseSettingKey) => ({
                    [key]: {
                        ...DefaultCourseSettings[key],
                        value:
                            this.settings?.[key].value ??
                            DefaultCourseSettings[key].value,
                    },
                })
            )
        );
    }

    constructor(args: Partial<Course> = {}) {
        super();
        Object.assign(this, args);
    }
}
