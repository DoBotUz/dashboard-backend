import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Organization } from 'src/organizations/organization.entity';

export const STATUSES = {
  ACTIVE: 10,
  INACTIVE: 11,
  MODERATION: 9,
  DELETED: 0,
};

@Entity()
export class Promocode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  slug: string;
  
  @Column({ type: 'datetime', nullable: true })
  start_datetime: Date;

  @Column({ type: 'datetime', nullable: true })
  end_datetime: Date;

  @Column({ type: 'int', default: 0 })
  left: number;

  @Column({
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.ACTIVE
  })
  status: number;

  @CreateDateColumn({ name: 'created_at', readonly: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', readonly: true })
  updated_at: Date;

  @ManyToOne(type => Organization, org => org.promocodes, {
    nullable: false,
    eager: true,
  })
  organization: Organization;

  @Column('int')
  organizationId: number;
}