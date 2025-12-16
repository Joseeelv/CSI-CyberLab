import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, OneToMany, JoinColumn } from "typeorm";
import { Container } from "src/containers/container.entity";
import { Role } from "src/role/role.entity";
import { UserLab } from '../user-lab/user-lab.entity';
import { Exclude } from "class-transformer";

@Entity("User")
export class User {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { default: () => 'uuid_generate_v4()', unique: true })
  documentId: string;

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

  @OneToMany(() => UserLab, (userLab) => userLab.user)
  userLabs: UserLab[];

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created: Date;

  @Column({ nullable: true })
  updated: Date;
}
