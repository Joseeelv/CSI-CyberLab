import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinColumn } from "typeorm";
import { Container } from "src/containers/container.entity";
import { Lab } from "src/labs/lab.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  //DEBE DE SER UNA RELACION CON LA CLASE ROLE
  @Column({ nullable: true })
  role: string; // admin, student, teacher

  @ManyToMany(() => Container, (container) => container.user, {
    nullable: false
  })
  @JoinColumn({ name: 'containerId' })
  containers: Container[];

  @ManyToMany(() => Lab, (lab) => lab.users, {
    nullable: false
  })
  @JoinColumn({ name: 'labId' })
  labs: Lab[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , nullable: false})
  created: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;
}
