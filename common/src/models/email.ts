import { Type } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailInterface, EmailProps, EmailProviderType, EmailStatus } from '../interfaces/email.interface';
import { Course } from './course';
import { User } from './user';

@Entity()
export class Email extends BaseEntity implements EmailInterface {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'timestamp', default: new Date() })
    public date: Date;

    @Column({ type: 'jsonb' })
    public email: EmailProps;

    @Column({ type: 'varchar' })
    public status: EmailStatus;

    @Column({ type: 'varchar' })
    public provider: EmailProviderType;

    @ManyToOne(() => Course, { eager: true })
    @JoinColumn()
    @Type(() => Course)
    public course: Course;

    @Column({ type: 'text', nullable: true })
    public failureReason?: string;

    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn()
    @Type(() => User)
    public creator?: User;

    constructor(args: Partial<Email> = {}) {
        super();
        Object.assign(this, args);
    }
}
