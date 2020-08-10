import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Organization } from 'src/organizations/organization.entity';

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

  @Column('varchar', { length: 255 })
  @Exclude()
  password_hash: string;

  @Column({ 'type': 'datetime', 'nullable': true })
  last_seen: Date;

  @Column('varchar', { length: 255, 'nullable': true })
  password_reset_token: string;

  @Column('double', {
    'default': 0
  })
  balance: number;

  @Column({
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.ACTIVE
  })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(type => Organization, orgnization => orgnization.user)
  organizations: Organization[];
}