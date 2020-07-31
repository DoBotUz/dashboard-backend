import { Column, Model, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { Bot } from '../bots/bot.entity';

@Table({
  tableName: 'bot_notification_template',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class BotNotificationTemplate extends Model<BotNotificationTemplate> {
  public static STATUSES = {
    ACTIVE: 10,
    DELETED: 0,
  };
  public static TYPES = {
    MASS_SEND: 10,
    FEEDBACK_ANS: 11,
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
  status: number;

  @ForeignKey(() => Bot)
  @Column
  bot_id: number;

  @BelongsTo(() => Bot)
  bot: Bot;
}