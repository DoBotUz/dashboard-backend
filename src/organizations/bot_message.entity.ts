import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, PrimaryColumn, } from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class BotMessage {
  @PrimaryColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  title: string;

  @Column('text')
  ru_text: string;

  @Column('text')
  uz_text: string;

  @Column()
  en_text: string;

  @Column({
    default: false
  })
  is_active: boolean;

  @ManyToOne(type => Organization)
  organization: Organization;
}