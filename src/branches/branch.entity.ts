import { Column, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Organization } from '../organizations/organization.entity';

@Table({
  tableName: 'branch',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Branch extends Model<Branch> {
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
  lat: number;

  @Column
  lng: number;

  @Column
  title: string;

  @Column
  timetable: string;

  @Column
  is_all_day: number;

  @Column
  status: number;

  @ForeignKey(() => Organization)
  @Column
  organization_id: number;

  @BelongsTo(() => Organization)
  organization: Organization;
}