import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { CrudValidationGroups } from "@nestjsx/crud";
import { IsEmpty } from 'class-validator';
import { User } from '../users/user.entity';
import { Organization } from '../organizations/organization.entity';

export const TYPES = {
  'text': 0,
  'photo': 1,
  'location': 2,
};

@Exclude()
@Entity()
export class Message {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({
    type: 'int',
    default: TYPES.text
  })
  type: string;

  @Expose()
  @Column()
  author: number;

  @Expose()
  @Column({
    type: 'text'
  })
  text: string;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Expose()
  @Column({
    nullable: true
  })
  recipient: number;

  @Expose()
  @Column({
    default: false
  })
  sent_by_operator: boolean;

  @Expose()
  @Column({
    default: false,
  })
  is_read: boolean;

  @Expose()
  @ManyToOne(type => User, {
    cascade: true,
    nullable: true
  })
  operator: User;

  @Expose()
  @ManyToOne(type => Organization, {
    cascade: true
  })
  organization: Organization

  @Expose()
  @Column()
  organizationId?: number;
}
