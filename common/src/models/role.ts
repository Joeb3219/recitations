import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RuleTag } from '../abilities/ability.definition';
import { RoleInterface } from '../interfaces/role.interface';
import { Course } from './course';
import { User } from './user';

@Entity()
export class Role extends BaseEntity implements RoleInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    name: string;

    @ManyToOne(() => Course, { eager: true, nullable: true })
    @JoinColumn()
    @Type(() => Course)
    course?: Course;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn()
    @Type(() => User)
    public creator?: User;

    @Column({ type: 'jsonb' })
    abilities: string[];

    @Column({ type: 'varchar', nullable: true })
    ruleTag?: RuleTag;

    constructor(args: Partial<Role> = {}) {
        super();
        Object.assign(this, args);
    }
}
