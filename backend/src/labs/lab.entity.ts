import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { OperatingSystem } from 'src/operating-systems/os.entity';
import { Category } from 'src/categories/category.entity';
import { Difficulty } from 'src/difficulty/difficulty.entity';
import { Container } from 'src/containers/container.entity';
import { Status } from 'src/status/status.entity';
import { FlagSubmission } from 'src/flag-submission/flag-submission.entity';

@Entity()
export class Lab {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @Column({ type: 'float', default: 0.0 })
  points: number;

  @Column({ type: 'int', default: 30 })
  estimatedTime: number;

  @Column({ type: 'simple-json', nullable: true })
  tags: string[];

  @Column({ type: 'simple-json', nullable: true }) //Un lab puede tener varias banderas
  flag: string[];

  @Exclude()
  @Column({ name: 'statusId', nullable: true })
  statusId: number;

  @ManyToOne(() => Status, (status) => status.labs, { eager: true })
  @JoinColumn({ name: 'statusId' })
  status: Status;

  @Exclude()
  @Column({ name: 'categoryId', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true, eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Exclude()
  @Column({ name: 'difficultyId', nullable: true })
  difficultyId: number;

  @ManyToOne(() => Difficulty, (difficulty) => difficulty.labs, { nullable: true, eager: true })
  @JoinColumn({ name: 'difficultyId' })
  difficulty: Difficulty;

  @Exclude()
  @Column({ name: 'operatingSystemId', nullable: true })
  operatingSystemId: number;

  @ManyToOne(() => OperatingSystem, (os) => os.labs, { nullable: true, eager: true })
  @JoinColumn({ name: 'operatingSystemId' })
  operatingSystem: OperatingSystem;

  @OneToMany(() => Container, (container) => container.labId, { nullable: true })
  containers: Container[];

  @ManyToMany(() => User, (user) => user.labs, { nullable: true })
  @JoinTable({ name: 'Lab_User' })
  users: User[];

  @OneToMany(() => FlagSubmission, (flagSubmission) => flagSubmission.labId)
  flagSubmissions: FlagSubmission[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;
}