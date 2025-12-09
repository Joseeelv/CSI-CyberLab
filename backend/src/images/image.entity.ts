import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Container } from 'src/containers/container.entity';
import { OperatingSystem } from 'src/operating-systems/os.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  version: string | null;

  @OneToMany(() => OperatingSystem, (os) => os.id, {
    nullable: false
  })
  @JoinColumn({ name: 'operatingSystemId' })
  operatingSystem: OperatingSystem;

  @Column({ type: 'varchar', length: 255, nullable: true })
  repository: string | null;

  @OneToMany(() => Container, (container) => container.image, {
    nullable: false
  })
  @JoinColumn({ name: 'imageId' })
  containers: Container[];

  @ManyToOne(() => OperatingSystem, (os) => os.id, { nullable: false })
  @JoinColumn({ name: 'baseOperatingSystemId' })
  baseOperatingSystem: OperatingSystem;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;
}