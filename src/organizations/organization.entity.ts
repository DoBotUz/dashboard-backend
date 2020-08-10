import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Bot } from 'src/bots/bot.entity';
import { Branch } from 'src/branches/branch.entity';
import { Order } from 'src/orders/order.entity';

export const STATUSES = {
  ACTIVE: 10,
  INACTIVE: 11,
  MODERATION: 9,
  DELETED: 0,
};

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { 'length': 255 })
  ru_title: string;

  @Column('text')
  ru_description: string;

  @Column('varchar', { 'length': 255 })
  en_title: string;

  @Column('text')
  en_description: string;

  @Column('varchar', { 'length': 255 })
  uz_title: string;

  @Column('text')
  uz_description: string;

  @Column('varchar', { 'length': 255, 'nullable': true })
  thumbnail: string;

  @Column('boolean', { 'default': false })
  is_multilanguage: number;

  @Column('double', { 'default': 0 })
  min_order_charge: number;

  @Column('double', { 'default': 0 })
  free_distance: number;

  @Column('double')
  fixed_delivery_price: number;

  @Column('double', { 'nullable': true })
  per_km_deliver_price: number;

  @Column('int', { 'nullable': true })
  delivery_time_range_start: number;

  @Column('int', { 'nullable': true })
  delivery_time_range_end: number;

  @Column('int', { 'default': STATUSES.ACTIVE })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
  
  @ManyToOne(type => User, user => user.organizations)
  user: User;

  @OneToOne(type => Bot)
  bot: Bot;

  @OneToMany(type => Branch, branch => branch.organization)
  branches: Branch[];

  @OneToMany(type => Order, order => order.organization)
  orders: Order[];
}