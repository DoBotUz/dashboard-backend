import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { CrudValidationGroups } from "@nestjsx/crud";
import { IsEmpty } from 'class-validator';
import { User } from '../users/user.entity';
import { Organization } from '../organizations/organization.entity';

export const TYPES = {
  'text': 0,
  'photo': 1,
  'location': 2,
};

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    default: TYPES.text
  })
  type: string;

  @Column()
  author: number;

  @Column({
    type: 'text'
  })
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({
    nullable: true
  })
  recipient: number;

  @Column({
    default: false
  })
  sent_by_operator: boolean;

  @Column({
    default: false,
  })
  is_read: boolean;

  @ManyToOne(type => User, {
    cascade: true,
    nullable: true
  })
  operator: User;

  @ManyToOne(type => Organization, {
    cascade: true
  })
  organization: Organization

  @Column()
  organizationId?: number;
}
