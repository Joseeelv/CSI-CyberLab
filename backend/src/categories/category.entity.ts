import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Lab } from 'src/labs/lab.entity';
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;

  @ManyToMany(() => Lab, (lab) => lab.categories, { nullable: true })
  labs: Lab[];
}