import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Lab } from '../labs/lab.entity';

@Entity('user_labs')
export class UserLab {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userLabs)
  user: User;

  @ManyToOne(() => Lab, (lab) => lab.userLabs)
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