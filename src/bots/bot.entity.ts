import { Column, Model, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { Organization } from '../organizations/organization.entity';

@Table({
  tableName: 'bot',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Bot extends Model<Bot> {
  public static STATUSES = {
    ACTIVE: 10,
    INACTIVE: 11,
    MODERATION: 9,
    DELETED: 0,
  };

  public static searchable = [
    'title'
  ];

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column
  title: string;

  @Column
  token: string;

  @Column(DataType.DATE)
  last_container_poke: number;

  @Column
  status: number;

  @ForeignKey(() => Organization)
  @Column
  organization_id: number;

  @BelongsTo(() => Organization)
  organization: Organization;
}