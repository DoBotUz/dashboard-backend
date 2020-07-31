import { Column, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { BotNotification } from './bot-notification.entity';

@Table({
  tableName: 'bot_notification_bot_user',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class BotNotificationBotUser extends Model<BotNotificationBotUser> {
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

  @ForeignKey(() => BotNotification)
  @Column
  bot_notification_id: number;

  @BelongsTo(() => BotNotification)
  botNotification: BotNotification;

  @ForeignKey(() => BotUser)
  @Column
  bot_user_id: number;

  @BelongsTo(() => BotUser)
  bot_user: BotUser;
}