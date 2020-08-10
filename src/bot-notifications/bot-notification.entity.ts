import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { Bot } from 'src/bots/bot.entity';
import { BotNotificationTemplate } from './bot-notification-template.entity';
import { BotUser } from 'src/bot-users/bot-user.entity';

export const STATUSES = {
  SENT: 10,
  PENDING: 9,
  ERROR: 0,
};

@Entity()
export class BotNotification {
  public static STATUSES = {
    SENT: 10,
    PENDING: 9,
    ERROR: 0,
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.PENDING
  })
  status: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  after_date_time: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(type => Bot, bot => bot.bot_notifications)
  bot: Bot;

  @ManyToOne(type => BotNotificationTemplate, template => template.bot_notifications)
  template: BotNotificationTemplate;

  @ManyToMany(type => BotUser)
  @JoinTable()
  bot_users: BotUser[];
}