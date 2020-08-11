import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { Organization } from 'src/organizations/organization.entity';
import { Branch } from 'src/branches/branch.entity';
import { Item } from 'src/items/item.entity';
import { Order } from './order.entity';


@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  orderId: number;

  @Column('int')
  itemId: number;

  @Column({ type: 'int', default: 1 })
  amount: number;

  @ManyToOne(type => Order, order => order.order_items, {
    nullable: false,
    eager: true,
  })
  order: Order;

  @ManyToOne(type => Item, item => item.order_items, {
    nullable: false,
    eager: true,
  })
  item: Item;
}