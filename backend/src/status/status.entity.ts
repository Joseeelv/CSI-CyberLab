import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Container } from 'src/containers/container.entity';
import { Lab } from 'src/labs/lab.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;

  @OneToMany(() => Container, (container) => container.status, { nullable: true })
  containers: Container[];

  // Labs reference status via ManyToOne -> Lab.status
  @OneToMany(() => Lab, (lab) => lab.status, { nullable: true })
  labs: Lab[];
}