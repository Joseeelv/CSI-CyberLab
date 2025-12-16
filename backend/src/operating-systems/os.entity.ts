import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany } from 'typeorm';
import { Lab } from 'src/labs/lab.entity';
import { Image } from 'src/images/image.entity';
@Entity()
export class OperatingSystem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  name: string;

  @OneToMany(() => Lab, (lab) => lab.operatingSystem)
  labs: Lab[];

  @OneToMany(() => Image, (image) => image.operatingSystem)
  images: Image[];
}