import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, } from 'typeorm';
import { User } from 'src/users/user.entity';


export const KEYS = {
  NEW_ORDER: 1,
  NEW_FEEDBACK: 2,
  NEW_MESSAGE: 3,
  NEW_BOT_USER: 4,
};

export const TYPES = {
  INFO: 1,
  WARNING: 2,
};

export const STATUSES = {
  PENDING: 10,
  FLASHED: 11,
  READ: 0,
};

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 1024, nullable: true })
  comment: string;

  @Column({
    type: 'enum',
    enum: Object.values(KEYS),
  })
  key: number;

  @Column('int')
  key_id: number;
  
  @Column({
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.PENDING
  })
  status: number;

  @Column({
    type: 'enum',
    enum: Object.values(TYPES),
  })
  type: number;

  @CreateDateColumn({ name: 'created_at', readonly: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', readonly: true })
  updated_at: Date;
  
  @ManyToOne(type => User, user => user.notifications, {
    nullable: false,
    eager: true
  })
  user: User;

  @Column({
    type: 'int',
    readonly: true
  })
  userId: number;
}