import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { v4 } from 'uuid';
import { LearningGoalInterface } from '../interfaces';
import { LearningGoalCategory } from './learningGoalCategory';

@Entity()
export class LearningGoal extends BaseEntity implements LearningGoalInterface {
    @Column({ type: 'uuid', unique: true, default: v4(), primary: true })
    public id: string = v4();

    @Column()
    public number: string;

    @Column()
    public name: string;

    @ManyToOne(t => LearningGoalCategory)
    @JoinColumn()
    @Type(() => LearningGoalCategory)
    public category: LearningGoalCategory;

    @Column()
    public description: string;

    constructor(args: Partial<LearningGoal> = {}) {
        super();
        Object.assign(this, args);
    }
}
