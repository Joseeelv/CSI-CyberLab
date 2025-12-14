import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
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

  @ManyToOne(() => User, (user) => user.flagSubmissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Lab, (lab) => lab.flagSubmissions)
  @JoinColumn({ name: 'labId' })
  lab: Lab;
}