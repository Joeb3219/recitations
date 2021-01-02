import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserInterface } from '../interfaces';
import { Role } from './role';

@Entity()
export class User extends BaseEntity implements UserInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public firstName: string;

    @Column()
    public lastName: string;

    @Column()
    public username: string;

    @Column()
    public email: string;

    @ManyToMany(() => Role, { eager: true })
    @JoinTable()
    @Type(() => Role)
    public roles: Role[];

    @Column({ type: 'varchar', select: false, nullable: true })
    public passwordHash?: string | undefined;

    constructor(args: Partial<User> = {}) {
        super();
        Object.assign(this, args);
    }

    public getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
}
