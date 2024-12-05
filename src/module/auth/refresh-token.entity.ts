import { sign } from 'jsonwebtoken';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  userAgent: string;

  @Column()
  ipAddress: string;

  constructor(userId: number, userAgent: string, ipAddress: string) {
    this.userId = userId;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
  }

  sign(): string {
    return sign({ ...this }, process.env.REFRESH_SECRET);
  }
}
