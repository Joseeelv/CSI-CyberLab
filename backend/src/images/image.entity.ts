import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Container } from 'src/containers/container.entity';
import { OperatingSystem } from 'src/operating-systems/os.entity';
import { Exclude } from 'class-transformer';
import { Lab } from 'src/labs/lab.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255 })
  imageName: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  tag: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean; 

  @Column({ type: 'varchar', length: 255, nullable: true })
  repository: string | null;

  @Exclude()
  @OneToMany(() => Container, (container) => container.image, {
    nullable: false
  })
  @JoinColumn({ name: 'imageId' })
  containers: Container[];

  @Exclude()
  @ManyToOne(() => Lab, (lab) => lab.uuid, { nullable: true })
  @JoinColumn({ name: 'labId' })
  lab: Lab | null; 

  @Exclude()
  @ManyToOne(() => OperatingSystem, (os) => os.images, { nullable: true })
  @JoinColumn({ name: 'operatingSystemId' })
  operatingSystem: OperatingSystem | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;
}