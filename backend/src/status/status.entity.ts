import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Container } from 'src/containers/container.entity';
import { Lab } from 'src/labs/lab.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;

  @OneToMany(() => Container, (container) => container.status, { nullable: true })
  @JoinColumn({ name: 'containerId' })
  containers: Container[];

  @OneToMany(() => Lab, (lab) => lab.uuid, { nullable: true })
  @JoinColumn({ name: 'labId' })
  labs: Lab[];
}