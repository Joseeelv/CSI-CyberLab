import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import { Container } from "src/containers/container.entity";
import { Lab } from "src/labs/lab.entity";
import { Role } from "src/role/role.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Exclude()
  @ManyToOne(() => Role, (role) => role.id, {
    nullable: false
  })
  roleId: Role;

  @ManyToMany(() => Container, (container) => container.user, {
    nullable: false
  })
  @JoinTable({ name: "User_Container" })
  containers: Container[];

  @ManyToMany(() => Lab, (lab) => lab.users, {
    nullable: false
  })
  @JoinTable({ name: "User_Lab" })
  labs: Lab[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;
}
