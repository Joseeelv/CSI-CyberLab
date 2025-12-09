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
  
  @ManyToOne(() => Image, (image) => image.containers, { nullable: false })
  @JoinColumn({ name: 'imageId' })
  image: Image;

  @ManyToOne(() => Lab, (lab) => lab.containers, { nullable: false })
  lab: Lab;
  
  @ManyToOne(() => Status, (status) => status.containers, { nullable: false })
  status: Status;
  
  @ManyToOne(() => User, (user) => user.containers, { nullable: false })
  user: User;
  
  @Column({ type: 'timestamp', nullable: false })
  lastActivity: Date;
  @Column({ type: 'timestamp', nullable: false })
  created: Date;
}
