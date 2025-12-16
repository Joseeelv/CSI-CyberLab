import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/users/user.entity";
import { Lab } from "src/labs/lab.entity";
@Entity()
export class FlagSubmission {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, nullable: false })
  name: string;

  @Column({ type: 'boolean', default: false })
  isCorrect: boolean;

  @CreateDateColumn()
  created: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'userId' })
  userId: User;

  @ManyToOne(() => Lab, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'labId' })
  labId: Lab;
}