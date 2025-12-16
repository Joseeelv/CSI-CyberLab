import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/user.entity";
@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  token: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  userAgent: string;

  @Column({ type: "timestamp", nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column({ type: "timestamp", nullable: true, default: null })
  endTime: Date;

}