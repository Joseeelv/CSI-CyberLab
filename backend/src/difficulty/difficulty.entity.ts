import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lab } from 'src/labs/lab.entity';

@Entity()
export class Difficulty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @OneToMany(() => Lab, (lab) => lab.difficulty)
  labs: Lab[];
}
