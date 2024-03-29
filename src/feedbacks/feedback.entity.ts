import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Bot } from 'src/bots/bot.entity';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { Organization } from 'src/organizations/organization.entity';

export const STATUSES = {
  ANSWERED: 10,
  PENDING: 11,
  DELETED: 0,
};

export const TYPES = {
  text: 1,
  photo: 2,
  video: 3,
  audio: 4,
  voice: 5
}

export const ALLOWED_RATING = [1, 2, 3, 4, 5];

@Entity()
export class Feedback{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  comment: string;

  @Column('int', {
    nullable: true
  })
  rating: number;

  @Column({
    type: 'int',
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

  @Column('int')
  botUserId: number;

  @ManyToOne(type => Bot, bot => bot.bot_notifications,  {
    onDelete: 'CASCADE',
    nullable: false
  })
  bot: Bot;

  @ManyToOne(type => Organization, org => org.feedbacks, {
    onDelete: 'CASCADE',
    nullable: false
  })
  organization: Organization;

  @Column()
  organizationId?: number;

  @Column({
    type: 'enum',
    enum: Object.values(TYPES),
    default: TYPES.text
  })
  type: number;

  @Column({
    nullable: true
  })
  file: string;
}