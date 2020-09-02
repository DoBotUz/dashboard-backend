import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { Organization } from 'src/organizations/organization.entity';
import { Branch } from 'src/branches/branch.entity';
import { Item } from 'src/items/item.entity';
import { OrderItem } from './order-item';
import { Promocode } from 'src/promocodes/promocode.entity';


export const STATUSES = {
  DELETED: 0,
  NEW: 10,
  CANCELED: 11,
  ACCEPTED: 12,
  READY: 13,
  DRIVER_ACCEPTED: 14,
  DELIVERED: 15
};

export const PAYMENT_TYPES = {
  CASH: 10,
  CARD: 0,
};

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('double')
  total_charge: number;

  @Column('double')
  delivery_charge: number;

  @Column('datetime')
  for_datetime: Date;

  @Column('double', { nullable: true })
  lat: number;

  @Column('double', { nullable: true })
  lng: number;

  @Column('text', { nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: Object.values(PAYMENT_TYPES),
    default: PAYMENT_TYPES.CASH
  })
  payment_type: number;

  @Column('varchar', { length: 255 })
  phone: string;

  @Column('text', { nullable: true })
  comment: string;

  @Column({
    type: 'int',
    default: STATUSES.NEW
  })
  status: number;

  @Column('boolean', { default: false })
  is_paid: boolean;

  @Column('boolean', { default: false })
  is_self_service: boolean;

  @CreateDateColumn({ name: 'created_at', readonly: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', readonly: true })
  updated_at: Date;

  @ManyToOne(type => BotUser, botUser => botUser.orders,  {
    onDelete: 'CASCADE',
    nullable: false
  })
  bot_user: BotUser;

  @Column('int')
  botUserId: number;

  @ManyToOne(type => Organization, organization => organization.orders,  {
    onDelete: 'CASCADE',
    nullable: false
  })
  organization: Organization;

  @Column('int')
  organizationId: number;

  @ManyToOne(type => Branch, branch => branch.orders,  {
    onDelete: 'CASCADE',
    nullable: false
  })
  branch: Branch;

  @Column('int')
  branchId: number;

  @ManyToOne(type => Promocode, promocode => promocode.orders,{
    onDelete: 'CASCADE',
  })
  promocode: Promocode;

  @Column('int', { nullable: true })
  promocodeId: number;
  
  @OneToMany(type => OrderItem, orderItem => orderItem.order)
  order_items: OrderItem[];
}