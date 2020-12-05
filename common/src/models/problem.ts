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
import { ProblemInterface } from '../interfaces';
import { Course, LearningGoal, User } from '../models';

@Entity()
export class Problem extends BaseEntity implements ProblemInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public difficulty: number;

    @Column()
    public name: string;

    @Column()
    public question: string;

    @Column()
    public solution: string;

    @Column()
    public estimatedDuration: number;

    @ManyToMany(() => LearningGoal, { cascade: true, eager: true })
    @JoinTable()
    @Type(() => LearningGoal)
    public learningGoals: LearningGoal[];

    @ManyToOne(() => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    @ManyToOne(() => User, { eager: true, cascade: true })
    @JoinColumn()
    @Type(() => User)
    public creator?: User;

    constructor(args: Partial<Problem> = {}) {
        super();
        Object.assign(this, args);
    }

    public static getMinuteUnit(estimatedDuration: number): string {
        if (!estimatedDuration) return '';
        let unit: string;
        unit = estimatedDuration > 1 ? (unit = 'minutes') : (unit = 'minute');
        return unit;
    }
}
