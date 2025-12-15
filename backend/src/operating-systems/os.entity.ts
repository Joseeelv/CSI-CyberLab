import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Lab } from "src/labs/lab.entity";
import { Image } from "src/images/image.entity";
import { Exclude } from "class-transformer";

@Entity("OperatingSystem")
export class OperatingSystem {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 64, nullable: false })
  name: string;

  @Exclude()
  @OneToMany(() => Lab, (lab) => lab.operatingSystem, { nullable: true })
  @JoinColumn({ name: "labId" })
  labs: Lab[];

  @Exclude()
  @OneToMany(() => Image, (image) => image.uuid, { nullable: false })
  @JoinColumn({ name: "image" })
  images: Image[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date;
  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated: Date;
}
