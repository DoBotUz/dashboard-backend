import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Bot } from 'src/bots/bot.entity';
import { Branch } from 'src/branches/branch.entity';
import { Order } from 'src/orders/order.entity';
import { Category } from 'src/categories/category.entity';
import { Item } from 'src/items/item.entity';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { Feedback } from 'src/feedbacks/feedback.entity';
import { Promocode } from 'src/promocodes/promocode.entity';
import { MailingTemplate } from 'src/mailing-templates/mailing-template.entity';


export const STATUSES = {
  DELETED: 0,
  MODERATION: 9,
  ACTIVE: 10,
  INACTIVE: 11,
};

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { 'length': 255 })
  title: string;

  @Column('varchar', { 'length': 255 })
  slug: string;

  @Column('text')
  ru_description: string;

  @Column('text')
  en_description: string;

  @Column('text')
  uz_description: string;

  @Column('varchar', { 'length': 255, 'nullable': true })
  thumbnail: string;

  @Column({
    type: 'int',
    default: STATUSES.ACTIVE
  })
  status: number;

  @Column('text', { nullable: true })
  delivery_settings: string;

  @CreateDateColumn({ name: 'created_at', readonly: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', readonly: true })
  updated_at: Date;
  
  @ManyToOne(type => User, user => user.organizations, {
    nullable: false,
    eager: true
  })
  user: User;

  @Column({
    type: 'int',
    readonly: true
  })
  userId: number;

  @OneToOne(type => Bot, bot => bot.organization, {
    eager: true
  })
  bot: Bot;

  @OneToMany(type => Branch, branch => branch.organization, {
    eager: true
  })
  branches: Promise<Branch[]>;

  @OneToMany(type => Category, category => category.organization)
  categories: Promise<Category[]>;

  @OneToMany(type => Item, item => item.organization)
  items: Promise<Item[]>;

  @OneToMany(type => Order, order => order.organization)
  orders: Order[];

  @OneToMany(type => BotUser, botUser => botUser.organization)
  botUsers: Promise<BotUser[]>;

  @OneToMany(type => Feedback, feedback => feedback.organization)
  feedbacks: Feedback[];

  @OneToMany(type => Promocode, promocode => promocode.organization)
  promocodes: Promocode[];

  @OneToMany(type => MailingTemplate, template => template.organization)
  mailing_templates: MailingTemplate[];

  @OneToMany(type => User, user => user.organization)
  workers: User[];
}