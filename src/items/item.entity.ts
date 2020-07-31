import { Column, Model, Table, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { Category } from 'src/categories/category.entity';
import { File } from 'src/files/file.entity';

@Table({
  tableName: 'item',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Item extends Model<Item> {
  public static STATUSES = {
    ACTIVE: 10,
    MODERATION: 9,
    INACTIVE: 0,
  };

  public static searchable = [
    'ru_title', 'ru_description', 'en_title', 'en_description', 'uz_title', 'uz_description',
  ];

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column
  ru_title: string;

  @Column
  ru_description: string;

  @Column
  en_title: string;

  @Column
  en_description: string;

  @Column
  uz_title: string;

  @Column
  uz_description: string;

  @Column
  thumbnail: string;

  @Column
  price: number;

  @Column
  amount: number;

  @Column
  status: number;

  @ForeignKey(() => Category)
  @Column
  category_id: number;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => File, {
    foreignKey: 'key_id',
  })
  files: File[]
}