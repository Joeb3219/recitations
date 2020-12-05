import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LearningGoalCategoryInterface } from '../interfaces';
import { Course } from './course';
import { LearningGoal } from './learningGoal';

@Entity()
export class LearningGoalCategory extends BaseEntity implements LearningGoalCategoryInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public number: string;

    @Column()
    public name: string;

    @OneToMany(t => LearningGoal, goal => goal.category, { cascade: true, eager: true })
    goals: LearningGoal[];

    @ManyToOne(type => Course, course => course.sections, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    constructor(args: Partial<LearningGoalCategory> = {}) {
        super();
        Object.assign(this, args);
    }
}
