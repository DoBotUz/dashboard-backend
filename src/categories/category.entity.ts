import { Column, Model, Table, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { Bot } from 'src/bots/bot.entity';
import { File } from 'src/files/file.entity';

@Table({
  tableName: 'category',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Category extends Model<Category> {
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
  pos: number;

  @Column
  status: number;

  @ForeignKey(() => Category)
  @Column
  parent_category_id: number;

  @BelongsTo(() => Category, {
    foreignKey: {
      allowNull: true
    }
  })
  parent_category: Category;

  
  @ForeignKey(() => Bot)
  @Column
  bot_id: number;

  @BelongsTo(() => Bot)
  bot: Bot;

  @HasMany(() => File, {
    foreignKey: 'key_id',
  })
  files: File[]
}