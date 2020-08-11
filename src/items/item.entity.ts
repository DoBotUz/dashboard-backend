import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { Organization } from 'src/organizations/organization.entity';
import { OrderItem } from 'src/orders/order-item';


export const STATUSES = {
  ACTIVE: 10,
  MODERATION: 9,
  INACTIVE: 0,
};

@Entity()
export class Item {

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

  @Column('double')
  price: number;

  @Column('int', { default: 1 })
  amount: number;

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

  @ManyToOne(type => Category, category => category.items,  {
    nullable: false
  })
  category: Category;

  @Column('int')
  categoryId: number;

  @ManyToOne(type => Organization, org => org.items,  {
    nullable: false
  })
  organization: Organization;

  @Column('int')
  organizationId?: number;

  @OneToMany(type => OrderItem, orderItem => orderItem.item)
  order_items: OrderItem[];
}