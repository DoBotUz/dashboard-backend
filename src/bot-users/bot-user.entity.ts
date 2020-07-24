import { Column, Model, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { Bot } from '../bots/bot.entity';


@Table({
  tableName: 'bot_user',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class BotUser extends Model<BotUser> {
  public static STATUSES = {
    ACTIVE: 10,
    BANNED: 0,
  };

  public static searchable = [
    'first_name', 'last_name', 'phone_number', 'username', 'bio', 'tg_id',
  ];

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column
  tg_id: number;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  phone_number: string;

  @Column
  username: string;

  @Column
  bio: string;

  @Column
  avatar: string;

  @Column
  language: string;

  @Column(DataType.DATE)
  last_seen: number;

  @Column
  status: number;

  @ForeignKey(() => Bot)
  @Column
  bot_id: number;

  @BelongsTo(() => Bot)
  bot: Bot;
}