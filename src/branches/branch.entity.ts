import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from 'src/organizations/organization.entity';
import { Order } from 'src/orders/order.entity';
import { Exclude } from 'class-transformer';
import { CrudValidationGroups } from "@nestjsx/crud";
import { IsEmpty } from 'class-validator';


const { CREATE, UPDATE } = CrudValidationGroups;

export const STATUSES = {
  DELETED: 0,
  MODERATION: 9,
  ACTIVE: 10,
  INACTIVE: 11,
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
  ru_title: string;

  @Column('varchar', { 'length': 255 })
  en_title: string;

  @Column('varchar', { 'length': 255 })
  uz_title: string;

  @Column('json', { 'nullable': true })
  timetable: string;

  @Column('boolean', { 'default': true })
  is_all_day: number;

  @Column({
    type: 'int',
    default: STATUSES.ACTIVE
  })
  status: number;

  @Column('int', {
    nullable: true
  })
  tg_group_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
  
  @ManyToOne(type => Organization, organization => organization.branches, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @IsEmpty({ groups: [CREATE, UPDATE] })
  organization: Organization;

  @Column()
  @IsEmpty({ groups: [CREATE, UPDATE] })
  organizationId: number;

  @OneToMany(type => Order, order => order.branch)
  orders: Order[];
}