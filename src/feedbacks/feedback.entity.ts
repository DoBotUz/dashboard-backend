import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Bot } from 'src/bots/bot.entity';
import { BotUser } from 'src/bot-users/bot-user.entity';

export const STATUSES = {
  ANSWERED: 10,
  PENDING: 11,
};

@Entity()
export class Feedback{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  comment: string;

  @Column({
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.PENDING
  })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(type => BotUser, botuser => botuser.feedbacks,  {
    nullable: false
  })
  bot_user: BotUser;

  @ManyToOne(type => Bot, bot => bot.feedbacks,  {
    nullable: false
  })
  bot: Bot;
}