import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Bot } from 'src/bots/bot.entity';
import { BotNotification } from 'src/bot-notifications/bot-notification.entity';
import { IsEmpty } from 'class-validator';
import { CrudValidationGroups } from "@nestjsx/crud";
import { Organization } from 'src/organizations/organization.entity';


const { CREATE, UPDATE } = CrudValidationGroups;

export const STATUSES = {
  DELETED: 0,
  DRAFTS: 10,
  SENT: 11,
  SENDING: 12,
};

export const TYPES = {
  MAILING: 10,
  FEEDBACK_ANS: 11,
}

export const CATS_ARRAY = [
  {
    value: 'news',
    color: 'primary',
    text: 'Новости',
  },
  {
    value: 'promos',
    color: 'success',
    text: 'Акции',
  },
  {
    value: 'warnings',
    color: 'warning',
    text: 'Оповещения',
  }
];

export const CATS_ENUM = {
  NEWS: 'news',
  WARNINGS: 'warnings',
  PROMOS: 'promos',
}

@Entity()
export class MailingTemplate {
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
    type: 'int',
    default: STATUSES.DRAFTS
  })
  status: number;

  @Column({
    type: 'varchar',
    length: '255',
    default: CATS_ENUM.NEWS
  })
  category: string;

  @Column({
    type: 'int',
    default: TYPES.MAILING
  })
  type: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  after_date_time: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
  
  @ManyToOne(type => Organization, org => org.mailing_templates,  {
    onDelete: 'CASCADE',
    nullable: false
  })
  @IsEmpty({ groups: [CREATE, UPDATE] })
  organization: Organization;

  @Column('int')
  @IsEmpty({ groups: [CREATE, UPDATE] })
  organizationId: number;

  @OneToOne(type => BotNotification, botNotification => botNotification.mailing_template)
  bot_notification: BotNotification;
}