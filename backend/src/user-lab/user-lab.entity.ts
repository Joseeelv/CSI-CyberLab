import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "src/users/user.entity";
import { Lab } from "src/labs/lab.entity";
import { FlagSubmission } from "src/flag-submission/flag-submission.entity";

@Entity("User_Lab")
export class UserLab {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "uuid" })
  labId: string;

  @ManyToOne(() => User, (user) => user.userLabs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "documentId" })
  user: User;

  @ManyToOne(() => Lab, (lab) => lab.userLabs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "labId", referencedColumnName: "uuid" })
  lab: Lab;

  @Column({ type: "float", nullable: true })
  progress: number;

  @Column({ type: "float", nullable: true })
  score: number;

  @Column({ type: "boolean", default: false })
  isFinished: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  started: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated: Date;

  @OneToMany(() => FlagSubmission, (flagSubmission) => flagSubmission.userLab)
  flagSubmissions: FlagSubmission[];
}
