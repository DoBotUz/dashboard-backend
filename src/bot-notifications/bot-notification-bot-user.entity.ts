import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { BotNotification } from './bot-notification.entity';


export const STATUSES = {
  SENT: 10,
  PENDING: 9,
  ERROR: 0,
};

@Entity()
export class BotNotificationBotUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.PENDING
  })
  status: number;

  @Column('int')
  botNotificationId: number;

  @Column('int')
  botUserId: number;

  @ManyToOne(type => BotNotification, notif => notif.bot_notif_bot_users, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  notification: BotNotification;

  @ManyToOne(type => BotUser, botUser => botUser.bot_notif_bot_users, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  bot_user: BotUser;

}