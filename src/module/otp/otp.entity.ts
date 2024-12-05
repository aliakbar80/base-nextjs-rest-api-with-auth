import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BeforeInsert,
  } from 'typeorm';
  
  @Entity()
  export class Opt {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    phoneNumber: string;
  
    @Column()
    code: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    expiredAt: Date;
  
    @Column({ default: false })
    isVerified: boolean;
  
    @BeforeInsert()
    setExpiryDate() {
      const createdAt = new Date();
      this.createdAt = createdAt;
      this.expiredAt = new Date(createdAt.getTime() + 2 * 60000); // 2 minutes after createdAt
    }
  }
  