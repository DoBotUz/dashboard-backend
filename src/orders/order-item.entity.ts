import { Column, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Item } from '../items/item.entity';
import { Order } from './order.entity';

@Table({
  tableName: 'order_item',
  underscored: true,
  timestamps: false,
})
export class OrderItem extends Model<OrderItem> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column
  amount: number;

  @ForeignKey(() => Order)
  @Column
  order_id: number;

  @BelongsTo(() => Order)
  order: Order;

  @ForeignKey(() => Item)
  @Column
  item_id: number;

  @BelongsTo(() => Item)
  item: Item;
}