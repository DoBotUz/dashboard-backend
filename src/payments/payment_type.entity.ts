import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
import { Organization } from 'src/organizations/organization.entity';

export const TYPES = {
  cash: 'CASH',
  card: 'CARD',
  payme: 'PAYME',
  click: 'CLICK', 
}

export const DEFAULT_VALUE = [
  { payment_type: 'CASH', needs_token: false, token: null, is_active: true },
  { payment_type: 'CARD', needs_token: false, token: null, is_active: false },
  { payment_type: 'PAYME', needs_token: true, token: null, is_active: false },
  { payment_type: 'CLICK', needs_token: true, token: null, is_active: false },
]

@Entity()
export class PaymentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Object.values(TYPES),
  })
  payment_type: string;

  @Column({
    default: false
  })
  needs_token: boolean;

 @Column({
   nullable: true
 })
 token: string;

 @Column({
   default: false,
 })
 is_active: boolean;

 @ManyToOne(type => Organization, organization => organization.payment_types)
 organization: Organization;
}