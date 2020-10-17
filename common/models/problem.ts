import { ProblemInterface } from '@interfaces/problem.interface';
import { Course } from '@models/course';
import { User } from '@models/user';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

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

    @ManyToOne((type) => Course, { eager: true })
    @JoinColumn()
    public course: Course;

    @ManyToOne((type) => User, { eager: true, cascade: true })
    @JoinColumn()
    public creator?: User;

    constructor(args: Partial<Problem> = {}) {
        super();
        Object.assign(this, args);
    }

    public static getMinuteUnit(estimatedDuration: number): string | undefined {
        if (!estimatedDuration) return undefined;
        let unit: string;
        unit = estimatedDuration > 1 ? (unit = 'minutes') : (unit = 'minute');
        return unit;
    }
}
