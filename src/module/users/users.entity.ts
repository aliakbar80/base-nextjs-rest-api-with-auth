import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Uploads } from '../uploads/uploads.entity';

export enum Gender {
  Male = 'male',
  Female = 'female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  birthDate: Date;

  @Column('text')
  gender: Gender;

  @Column()
  password: string;

  @OneToMany(() => Uploads, (FileUploads) => FileUploads.user)
  FileUploads: Uploads[];

  async setPassword(newPassword: string): Promise<void> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(newPassword, salt);
  }

  @BeforeInsert()
  generateUsername() {
    const currentYear = new Date().getFullYear();
    this.username = `user-${this.phoneNumber}-${currentYear}`;
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
