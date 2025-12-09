import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinColumn, JoinTable, ManyToOne } from "typeorm";
import { Container } from "src/containers/container.entity";
import { Lab } from "src/labs/lab.entity";
import { Role } from "src/role/role.entity";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToMany(() => Container, (container) => container.user, {
    nullable: false
  })
  @JoinTable()
  containers: Container[];

  @ManyToMany(() => Lab, (lab) => lab.users, {
    nullable: false
  })
  @JoinTable()
  labs: Lab[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated: Date;
}
