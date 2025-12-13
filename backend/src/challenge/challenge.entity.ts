import { Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lab } from "src/labs/lab.entity";

@Entity()
export class Challenge {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false })
  difficulty: number;

  @ManyToOne(() => Lab, (lab) => lab.challenges, { onDelete: 'CASCADE' })
  lab: Lab;
}