import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export const KEYS = {
  ORGANIZATION: 1,
  BRANCH: 2,
  CATEGORY: 3,
  ITEM: 4,
  MAILING_TEMPLATE: 5,
  PROMO: 6,
};

export const TYPES = {
  IMAGE: 1,
  VIDEO: 2,
  AUDIO: 3,
  DOCUMENT: 4,
}

@Entity()
export class File{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Object.values(KEYS),
    default: KEYS.ORGANIZATION
  })
  key: number;

  @Column('int')
  key_id: number;

  @Column('varchar', { length: 1024 })
  file: string;

  @Column('varchar', { length: 1024 })
  original_name: string;

  @Column('double')
  size: number;

  @Column('varchar', { length: 255 })
  mime: string;

  @Column({
    type: 'enum',
    enum: Object.values(TYPES),
    default: TYPES.IMAGE
  })
  type: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}