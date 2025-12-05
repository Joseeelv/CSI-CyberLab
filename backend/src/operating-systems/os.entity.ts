import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany } from 'typeorm';
import { Lab } from 'src/labs/lab.entity';
import { Image } from 'src/images/image.entity';
@Entity()
export class OperatingSystem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  name: string;

  @OneToMany(() => Lab, (lab) => lab.operatingSystem, { nullable: true })
  @JoinColumn({ name: 'labId' })
  labs: Lab[];

  @OneToMany(() => Image, (image) => image.baseOperatingSystem, { nullable: false })
  @JoinColumn({ name: 'imageId' })
  images: Image[];

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updated: Date;
}