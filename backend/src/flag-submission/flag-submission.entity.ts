import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserLab } from "src/user-lab/user-lab.entity";
import { Lab } from "src/labs/lab.entity";

@Entity("FlagSubmission")
export class FlagSubmission {

  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 128, nullable: false })
  name: string;

  @Column({ type: "boolean", default: false })
  isCorrect: boolean;

  @CreateDateColumn()
  created: Date;

  @Column({ name: "userLabId", type: "int" })
  userLabId: number;

  @ManyToOne(() => UserLab, (userLab) => userLab.flagSubmissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userLabId" })
  userLab: UserLab;

  @Column({ name: "labId", type: "uuid" })
  labId: string;

  @ManyToOne(() => Lab, (lab) => lab.flagSubmissions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "labId", referencedColumnName: "uuid" })
  lab: Lab;
}
