import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from 'src/organizations/organization.entity';
import { Order } from 'src/orders/order.entity';
import { PromocodeItem } from './promocode-item.entity';

export const STATUSES = {
  DELETED: 0,
  MODERATION: 9,
  ACTIVE: 10,
  INACTIVE: 11,
};

export const TYPES = {
  PERCENT: 10,
  MONEY_AMOUNT_REDUCE: 11,
  FREE_SHIPMENT: 12,
  FREE_ITEMS: 13,
  CUSTOM: 14,
}

@Entity()
export class Promocode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  slug: string;
  
  @Column({ type: 'datetime', nullable: true })
  start_datetime: Date;

  @Column({ type: 'datetime', nullable: true })
  end_datetime: Date;

  @Column({ type: 'int', default: 0 })
  left: number;

  @Column({
    type: 'int',
    default: STATUSES.ACTIVE
  })
  status: number;

  @Column({
    type: 'int',
    default: TYPES.PERCENT
  })
  type: number;

  @Column('varchar', { nullable: true, length: 2048 })
  comment: string;

  @Column('double', { nullable: true })
  discount: number;

  @CreateDateColumn({ name: 'created_at', readonly: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', readonly: true })
  updated_at: Date;

  @ManyToOne(type => Organization, org => org.promocodes, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  organization: Organization;

  @Column('int')
  organizationId: number;

  @OneToMany(type => Order, order => order.promocode)
  orders: Order[];

  @OneToMany(type => PromocodeItem, promocodeItem => promocodeItem.promocode)
  promocode_items: PromocodeItem[];
}