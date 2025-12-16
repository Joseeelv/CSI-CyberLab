import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lab } from 'src/labs/lab.entity';
import { Exclude } from 'class-transformer';

@Entity("Difficulty")
export class Difficulty {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @OneToMany(() => Lab, (lab) => lab.difficulty)
  labs: Lab[];
}
