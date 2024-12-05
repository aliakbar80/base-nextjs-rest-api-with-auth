import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Uploads {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    destination: string;

    @Column()
    name: string;

    @Column()
    size: number;

    @Column()
    type: string;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.FileUploads)
    @JoinColumn({ name: 'userId' })
    user: User;
}

