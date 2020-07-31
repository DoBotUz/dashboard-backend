import { Column, Model, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { BotNotificationTemplate } from './bot-notification-template.entity';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { Bot } from 'src/bots/bot.entity';

@Table({
  tableName: 'bot_notification',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class BotNotification extends Model<BotNotification> {
  public static STATUSES = {
    SENT: 10,
    PENDING: 9,
    ERROR: 0,
  };

  public static searchable = [];

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column
  status: number;

  @Column(DataType.DATE)
  after_date_time: number;

  @ForeignKey(() => Bot)
  @Column
  bot_id: number;

  @BelongsTo(() => Bot)
  bot: Bot;

  @ForeignKey(() => BotNotificationTemplate)
  @Column
  bot_notification_template_id: number;

  @BelongsTo(() => BotNotificationTemplate)
  template: BotNotificationTemplate;

  @ForeignKey(() => BotUser)
  @Column
  bot_user_id: number;

  @BelongsTo(() => BotUser)
  bot_user: BotUser;
}