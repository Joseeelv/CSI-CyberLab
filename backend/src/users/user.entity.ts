import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, OneToMany, JoinColumn } from "typeorm";
import { Container } from "src/containers/container.entity";
import { Role } from "src/role/role.entity";
import { UserLab } from '../user-labs/user-lab.entity';

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

  @Exclude()
  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.id, {
    nullable: false
  })
  roleId: Role;

  @ManyToMany(() => Container, (container) => container.userId, {
    nullable: false,
    eager: true
  })
  @JoinTable({ name: "User_Container" })
  containers: Container[];

  @ManyToMany(() => Lab, (lab) => lab.users, {
    nullable: false,
    eager: true
  })
  @JoinTable({ name: "User_Lab" })
  labs: Lab[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created: Date;

  @Column({ nullable: true })
  updated: Date;

  @OneToMany(() => UserLab, (userLab) => userLab.user)
  userLabs: UserLab[];
}
