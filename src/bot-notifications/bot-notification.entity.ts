import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Bot } from 'src/bots/bot.entity';
import { MailingTemplate } from 'src/mailing-templates/mailing-template.entity';

export const STATUSES = {
  SENT: 10,
  PENDING: 9,
  ERROR: 0,
};

@Entity()
export class BotNotification {

  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(type => Bot, bot => bot.bot_notifications,  {
    onDelete: 'CASCADE',
    nullable: false
  })
  bot: Bot;

  @Column('int')
  botId: number;

  @OneToOne(type => MailingTemplate, template => template.bot_notification,  {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn()
  mailing_template: MailingTemplate;

  @Column('int')
  mailingTemplateId: number;
}