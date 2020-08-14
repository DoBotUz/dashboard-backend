import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Organization } from 'src/organizations/organization.entity';
import { Notification } from 'src/notifications/notification.entity'

export const STATUSES = {
  ACTIVE: 10,
  MODERATION: 9,
  DELETED: 0
};

@Entity()
export class User  {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    unique: true,
    length: 255
  })
  email: string;

  @Column('varchar', { length: 255 })
  first_name: string;

  @Column('varchar', { length: 255 })
  last_name: string;

  @Column({ type: 'varchar', length: 255, readonly: true, })
  @Exclude()
  password_hash: string;

  @Column({ type: 'datetime', nullable: true, readonly: true, })
  last_seen: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, readonly: true, })
  @Exclude()
  password_reset_token: string;

  @Column({
    type: 'double',
    default: 0,
    readonly: true,
  })
  balance: number;

  @Column({
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.ACTIVE
  })
  status: number;

  @CreateDateColumn({ name: 'created_at', readonly: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', readonly: true })
  updated_at: Date;

  @OneToMany(type => Organization, orgnization => orgnization.user)
  organizations: Organization[];

  @OneToMany(type => Notification, notification => notification.user)
  notifications: Notification[];
}