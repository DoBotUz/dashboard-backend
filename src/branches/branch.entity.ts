import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from 'src/organizations/organization.entity';
import { Order } from 'src/orders/order.entity';

export const STATUSES = {
  ACTIVE: 10,
  INACTIVE: 11,
  MODERATION: 9,
  DELETED: 0,
};

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double')
  lat: number;

  @Column('double')
  lng: number;

  @Column('varchar', { 'length': 255 })
  title: string;

  @Column('json', { 'nullable': true })
  timetable: string;

  @Column('boolean', { 'default': true })
  is_all_day: number;

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
  
  @ManyToOne(type => Organization, organization => organization.branches, {
    nullable: false
  })
  organization: Organization;

  @OneToMany(type => Order, order => order.branch)
  orders: Order[];
}