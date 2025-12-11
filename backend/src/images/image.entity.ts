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
  version: string;

  @ManyToOne(() => OperatingSystem, (os) => os.images, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'operatingSystemId' })
  operatingSystem: OperatingSystem;

  @OneToMany(() => Container, (container) => container.image)
  containers: Container[];
}