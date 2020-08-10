import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Bot } from 'src/bots/bot.entity';
import { Item } from 'src/items/item.entity';

export const STATUSES = {
  ACTIVE: 10,
  MODERATION: 9,
  INACTIVE: 0,
};

@Entity()
export class Category {
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

  @Column('int', { default: 0 } )
  pos: number;

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
  
  @ManyToOne(type => Category, category => category.children, { nullable: true })
  parent_category: Category;

  @OneToMany(type => Category, category => category.parent_category)
  children: Category[];

  @OneToMany(type => Item, item => item.category)
  items: Item[];

  @ManyToOne(type => Bot, bot => bot.categories)
  bot: Bot;
}