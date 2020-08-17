import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Organization } from 'src/organizations/organization.entity';
import { BotNotification } from 'src/bot-notifications/bot-notification.entity';
import { Feedback } from 'src/feedbacks/feedback.entity';
import { IsEmpty } from 'class-validator';
import { CrudValidationGroups } from "@nestjsx/crud";
import { BotUser } from 'src/bot-users/bot-user.entity';


const { CREATE, UPDATE } = CrudValidationGroups;

export const STATUSES = {
  ACTIVE: 10,
  INACTIVE: 11,
  MODERATION: 9,
  DELETED: 0,
};

@Entity()
export class Bot{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { 'length': 1024 })
  token: string;

  @Column('boolean', { default: false })
  is_online: boolean;

  @Column('datetime', { nullable: true })
  last_container_poke: Date;

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
  
  @OneToOne(type => Organization, org => org.bot, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @IsEmpty({ groups: [CREATE, UPDATE] })
  @JoinColumn()
  organization: Organization;

  @Column('int')
  @IsEmpty({ groups: [UPDATE] })
  organizationId: number;

  @OneToMany(type => BotNotification, botNotification => botNotification.template)
  bot_notifications: BotNotification[];

  @OneToMany(type => Feedback, feedback => feedback.bot)
  feedbacks: Feedback[];

  @OneToMany(type => BotUser, botUser => botUser.bot)
  botUsers: BotUser[];
}