import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Container } from 'src/containers/container.entity';
import { OperatingSystem } from 'src/operating-systems/os.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  version: string | null;

  @Exclude()
  @OneToMany(() => OperatingSystem, (os) => os.id, {
    nullable: false
  })
  @JoinColumn({ name: 'operatingSystemId' })
  operatingSystemId: OperatingSystem;

  @Column({ type: 'varchar', length: 255, nullable: true })
  repository: string | null;

  @OneToMany(() => Container, (container) => container.image, {
    nullable: false
  })
  @JoinColumn({ name: 'imageId' })
  containers: Container[];

  @Exclude()
  @ManyToOne(() => OperatingSystem, (os) => os.id, { nullable: false })
  @JoinColumn({ name: 'baseOperatingSystemId' })
  baseOperatingSystemId: OperatingSystem;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;
}