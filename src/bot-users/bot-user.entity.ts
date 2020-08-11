import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { Bot } from 'src/bots/bot.entity';
import { Feedback } from 'src/feedbacks/feedback.entity';
import { Order } from 'src/orders/order.entity';
import { BotNotification } from 'src/bot-notifications/bot-notification.entity';

export const STATUSES = {
  ACTIVE: 10,
  BANNED: 0,
};

@Entity()
export class BotUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  tg_id: number;

  @Column('varchar', { length: 255 })
  first_name: string;

  @Column('varchar', { length: 255, nullable: true })
  last_name: string;

  @Column('varchar', { length: 255, nullable: true })
  phone_number: string;

  @Column('varchar', { length: 255, nullable: true })
  username: string;

  @Column('text', { nullable: true })
  bio: string;

  @Column('varchar', { length: 255, nullable: true })
  avatar: string;

  @Column('varchar', { length: 20 })
  language: string;

  @Column('datetime', { nullable: true })
  last_seen: Date;

  @Column({
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.ACTIVE
  })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(type => Bot, bot => bot.bot_notifications,  {
    nullable: false
  })
  bot: Bot;

  @Column('int')
  botId: number;

  @OneToMany(type => Feedback, feedback => feedback.bot)
  feedbacks: Feedback[];

  @OneToMany(type => Order, order => order.bot_user)
  orders: Order[];

  @ManyToMany(type => BotNotification)
  bot_notifications: BotNotification[];
  
}