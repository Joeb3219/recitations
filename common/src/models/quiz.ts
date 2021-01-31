import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuizElementItem, QuizInterface } from '../interfaces/quiz.interface';
import { Course, User } from '../models';

@Entity()
export class Quiz extends BaseEntity implements QuizInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'varchar' })
    public name: string;

    @Column({ type: 'jsonb', default: '[]' })
    public elements: QuizElementItem[] = [];

    @ManyToOne(() => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn()
    @Type(() => User)
    public creator?: User;

    constructor(args: Partial<Quiz> = {}) {
        super();
        Object.assign(this, args);
    }
}
