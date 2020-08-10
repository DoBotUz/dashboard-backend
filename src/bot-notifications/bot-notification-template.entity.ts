import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Bot } from 'src/bots/bot.entity';
import { BotNotification } from './bot-notification.entity';

export const STATUSES = {
  ACTIVE: 10,
  DELETED: 0,
};

export const TYPES = {
  MASS_SEND: 10,
  FEEDBACK_ANS: 11,
}

@Entity()
export class BotNotificationTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  ru_title: string;

  @Column('text')
  ru_description: string;

  @Column('varchar', { length: 255 })
  en_title: string;

  @Column('text')
  en_description: string;

  @Column('varchar', { length: 255 })
  uz_title: string;

  @Column('text')
  uz_description: string;

  @Column('varchar', { length: 255, nullable: true })
  thumbnail: string;

  @Column({
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.ACTIVE
  })
  status: number;

  @Column({
    type: 'enum',
    enum: Object.values(TYPES),
    default: TYPES.MASS_SEND
  })
  type: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
  
  @ManyToOne(type => Bot, bot => bot.bot_notifications,  {
    nullable: false
  })
  bot: Bot;

  @OneToMany(type => BotNotification, botNotification => botNotification.template)
  bot_notifications: BotNotification[];
}