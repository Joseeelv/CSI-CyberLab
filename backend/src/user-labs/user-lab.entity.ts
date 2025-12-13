import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Lab } from '../labs/lab.entity';
import { Exclude } from 'class-transformer';

@Entity('user_labs')
export class UserLab {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  userId: number;

  @Exclude()
  @Column()
  labId: number;

  @ManyToOne(() => User, (user) => user.userLabs)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Lab, (lab) => lab.userLabs)
  @JoinColumn({ name: 'labId' })
  lab: Lab;

  @Column({ type: 'float', nullable: true })
  progress: number;

  @Column({ type: 'float', nullable: true })
  grade: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;
}