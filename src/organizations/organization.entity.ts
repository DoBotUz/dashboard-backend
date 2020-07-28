import { Column, Model, Table, BelongsTo, ForeignKey, HasOne } from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { Bot } from 'src/bots/bot.entity';

@Table({
  tableName: 'organization',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Organization extends Model<Organization> {
  public static STATUSES = {
    ACTIVE: 10,
    INACTIVE: 11,
    MODERATION: 9,
    DELETED: 0,
  };

  public static searchable = [
    'ru_title', 'ru_description', 'en_title', 'en_description', 'uz_title', 'uz_description',
  ];

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column
  ru_title: string;

  @Column
  ru_description: string;

  @Column
  en_title: string;

  @Column
  en_description: string;

  @Column
  uz_title: string;

  @Column
  uz_description: string;

  @Column
  thumbnail: string;

  @Column
  is_multilanguage: number;

  @Column
  min_order_charge: number;

  @Column
  free_distance: number;

  @Column
  fixed_delivery_price: number;

  @Column
  per_km_deliver_price: number;

  @Column
  delivery_time_range_start: number;

  @Column
  delivery_time_range_end: number;

  @Column
  status: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @HasOne(() => Bot)
  bot: Bot;
}