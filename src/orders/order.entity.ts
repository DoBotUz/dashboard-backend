import { Column, Model, Table, BelongsTo, ForeignKey, DataType, HasMany } from 'sequelize-typescript';
import { BotUser } from '../bot-users/bot-user.entity';
import { Organization } from 'src/organizations/organization.entity';
import { Branch } from 'src/branches/branch.entity';
import { OrderItem } from './order-item.entity';

@Table({
  tableName: 'order',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Order extends Model<Order> {
  public static STATUSES = {
    ACTIVE: 10,
    MODERATION: 9,
    CANCELED: 0,
    PAID: 11,
    DELIVERED: 12,
  };

  public static PAYMENT_TYPES = {
    CASH: 10,
    CARD: 0,
  };

  public static searchable = [];

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column
  total_charge: number;

  @Column
  delivery_charge: number;

  @Column(DataType.DATE)
  for_datetime: number;

  @Column
  lat: number;

  @Column
  lng: number;

  @Column
  address: string;

  @Column
  payment_type: number;

  @Column
  phone: string;

  @Column
  comment: string;

  @Column
  status: number;

  @Column
  is_paid: boolean;

  @ForeignKey(() => BotUser)
  @Column
  bot_user_id: number;

  @BelongsTo(() => BotUser)
  bot_user: BotUser;

  @ForeignKey(() => Organization)
  @Column
  organization_id: number;

  @BelongsTo(() => Organization)
  organization: Organization;

  @ForeignKey(() => Branch)
  @Column
  branch_id: number;

  @BelongsTo(() => Branch)
  branch: Branch;

  @HasMany(() => OrderItem)
  order_items: OrderItem[]
}