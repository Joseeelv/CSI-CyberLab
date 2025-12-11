import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { OperatingSystem } from 'src/operating-systems/os.entity';
import { Category } from 'src/categories/category.entity';
import { Difficulty } from 'src/difficulty/difficulty.entity';
import { User } from 'src/users/user.entity';
import { Container } from 'src/containers/container.entity';
import { Status } from 'src/status/status.entity';
@Entity()
export class Lab {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @ManyToOne(() => Status, (status) => status.labs)
  @JoinColumn({ name: 'statusId' })
  status: Status;

  @ManyToMany(() => Category, (category) => category.labs, { nullable: true })
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => Difficulty, (difficulty) => difficulty.labs, { nullable: true })
  @JoinColumn({ name: 'difficultyId' })
  difficulty: Difficulty;

  @ManyToOne(() => OperatingSystem, (os) => os.labs, { nullable: true })
  @JoinColumn({ name: 'operatingSystemId' })
  operatingSystem: OperatingSystem;
  
  @OneToMany(() => Container, (container) => container.lab, { nullable: true })
  containers: Container[];

  @ManyToMany(() => User, (user) => user.labs, { nullable: true })
  @JoinTable()
  users: User[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;
}