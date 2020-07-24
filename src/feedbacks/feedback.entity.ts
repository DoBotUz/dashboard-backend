import { Column, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { BotUser } from '../bot-users/bot-user.entity';

@Table({
  tableName: 'feedback',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Feedback extends Model<Feedback> {
  public static STATUSES = {
    ANSWERED: 10,
    PENDING: 11,
  };

  public static searchable = ['comment'];

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column
  comment: string;

  @Column
  status: number;

  @ForeignKey(() => BotUser)
  @Column
  bot_user_id: number;

  @BelongsTo(() => BotUser)
  bot_user: BotUser;
}