import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Lab } from 'src/labs/lab.entity';
import { Status } from 'src/status/status.entity';
import { User } from 'src/users/user.entity';
import { Image } from 'src/images/image.entity';

@Entity()
export class Container {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 64, nullable: true })
  name: string;

  @ManyToOne(() => Image, (image) => image.containers, { nullable: true })
  @JoinColumn({ name: 'imageId' })
  image: Image;

  @ManyToOne(() => Lab, (lab) => lab.containers, { nullable: true })
  @JoinColumn({ name: 'labId' })
  lab: Lab;

  @ManyToOne(() => Status, (status) => status.containers)
  @JoinColumn({ name: 'statusId' })
  status: Status;

  @ManyToOne(() => User, (user) => user.containers, { nullable: true })
  user: User;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  lastActivity: Date;
}
