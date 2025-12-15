import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Lab } from 'src/labs/lab.entity';
import { Status } from 'src/status/status.entity';
import { User } from 'src/users/user.entity';
import { Image } from 'src/images/image.entity';
import { Exclude } from 'class-transformer';

@Entity("Container")
export class Container {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  name: string;

  @Exclude()
  @ManyToOne(() => Image, (image) => image.containers, { nullable: true })
  @JoinColumn({ name: 'imageId' })
  imageId: Image;

  @Exclude()
  @ManyToOne(() => Lab, (lab) => lab.containers, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'labId' })
  labId: Lab;

  @Exclude()
  @ManyToOne(() => Status, (status) => status.containers, { nullable: true })
  @JoinColumn({ name: 'statusId' })
  statusId: Status;

  @Exclude()
  @ManyToOne(() => User, (user) => user.containers, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  userId: User;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  lastActivity: Date;
}
