import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { Organization } from 'src/organizations/organization.entity';
import { Branch } from 'src/branches/branch.entity';
import { Item } from 'src/items/item.entity';

export const STATUSES = {
  ACTIVE: 10,
  MODERATION: 9,
  CANCELED: 0,
  PAID: 11,
  DELIVERED: 12,
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
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.MODERATION
  })
  status: number;

  @Column('boolean', { default: false })
  is_paid: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(type => BotUser, botUser => botUser.orders,  {
    nullable: false
  })
  bot_user: BotUser;

  @ManyToOne(type => Organization, organization => organization.orders,  {
    nullable: false
  })
  organization: Organization;

  @ManyToOne(type => Branch, branch => branch.orders,  {
    nullable: false
  })
  branch: Branch;
  
  @ManyToMany(type => Item)
  @JoinTable()
  items: Item[];
}