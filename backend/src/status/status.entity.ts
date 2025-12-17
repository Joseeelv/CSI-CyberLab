import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Container } from "src/containers/container.entity";
import { Lab } from "src/labs/lab.entity";
import { Exclude } from "class-transformer";

@Entity("Status")
export class Status {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 32, nullable: false })
  name: string;

  @Exclude()
  @OneToMany(() => Container, (container) => container.statusId, {
    nullable: true,
  })
  @JoinColumn({ name: "containerId" })
  containers: Container[];

  @Exclude()
  @OneToMany(() => Lab, (lab) => lab.uuid, { nullable: true })
  @JoinColumn({ name: "labId" })
  labs: Lab[];
}
