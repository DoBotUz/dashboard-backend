import { Column, Model, Table,  } from 'sequelize-typescript';

@Table({
  tableName: 'file',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class File extends Model<File> {
  public static KEYS = {
    ORGANIZATION: 1,
    BRANCH: 2,
    CATEGORY: 3,
    ITEM: 4,
    NOTIFICATION_TEMPLATE: 5,
    PROMO: 6,
  };

  public static TYPES = {
    IMAGE: 1,
    VIDEO: 2,
    AUDIO: 3,
    DOCUMENT: 4,
  };

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column
  key: number;

  @Column
  key_id: number;

  @Column
  file: string;

  @Column
  original_name: string;

  @Column
  size: number;

  @Column
  mime: string;

  @Column
  type: number;
}