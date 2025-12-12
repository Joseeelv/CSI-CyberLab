import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Lab } from 'src/labs/lab.entity';
import { Status } from 'src/status/status.entity';
import { User } from 'src/users/user.entity';
import { Image } from 'src/images/image.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Container {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  name: string;

  @Exclude()
  @ManyToOne(() => Image, (image) => image.uuid, { nullable: true })
  @JoinColumn({ name: 'imageId' })
  image: Image;

  @Exclude()
  @ManyToOne(() => Lab, (lab) => lab.containers, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'labId' })
  lab: Lab;

  @Exclude()
  @ManyToOne(() => Status, (status) => status.containers, { nullable: true })
  @JoinColumn({ name: 'statusId' })
  status: Status;

  @Exclude()
  @ManyToOne(() => User, (user) => user.containers, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  lastActivity: Date;
}
