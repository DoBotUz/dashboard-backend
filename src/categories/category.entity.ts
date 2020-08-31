import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Item } from 'src/items/item.entity';
import { Organization } from 'src/organizations/organization.entity';


export const STATUSES = {
  ACTIVE: 10,
  INACTIVE: 11,
  MODERATION: 9,
  DELETED: 0,
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
    type: 'int',
    default: STATUSES.ACTIVE
  })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
  
  @ManyToOne(type => Category, category => category.children, { nullable: true })
  parent_category: Category;

  @Column('int', { nullable: true })
  parentCategoryId?: number;

  @OneToMany(type => Category, category => category.parent_category)
  children: Category[];

  @OneToMany(type => Item, item => item.category)
  items: Promise<Item[]>;

  @ManyToOne(type => Organization, org => org.categories,  {
    onDelete: 'CASCADE',
    nullable: false
  })
  organization: Organization;

  @Column('int')
  organizationId: number;
}