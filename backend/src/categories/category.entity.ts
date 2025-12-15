import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lab } from 'src/labs/lab.entity';
import { Exclude } from 'class-transformer';

@Entity("Category")
export class Category {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;

  @OneToMany(() => Lab, (lab) => lab.category, { nullable: true })
  labs: Lab[];
}