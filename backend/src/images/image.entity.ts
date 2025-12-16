import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Container } from "src/containers/container.entity";
import { OperatingSystem } from "src/operating-systems/os.entity";
import { Exclude } from "class-transformer";
import { Lab } from "src/labs/lab.entity";

@Entity("Image")
export class Image {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 32, nullable: true })
  tag: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  description: string | null;

  @Column({ type: "boolean", default: true })
  isPublic: boolean;

  @Exclude()
  @OneToMany(() => Container, (container) => container.imageId, {
    nullable: false,
  })
  @JoinColumn({ name: "imageId" })
  containers: Container[];

  @Exclude()
  @ManyToOne(() => Lab, { nullable: true })
  @JoinColumn({ name: "labId" })
  labId: Lab | null;

  @Exclude()
  @ManyToOne(() => OperatingSystem, (os) => os.images, { nullable: true })
  @JoinColumn({ name: "operatingSystemId" })
  operatingSystemId: OperatingSystem | null;


  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated: Date;
}
