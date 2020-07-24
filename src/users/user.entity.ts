import { Column, Model, Table, DataType, Unique, } from 'sequelize-typescript';

@Table({
  tableName: 'user',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class User extends Model<User> {
  public static STATUSES = {
    ACTIVE: 10,
    INACTIVE: 0
  };

  public static searchable = [
    'email', 'first_name', 'last_name',
  ];

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Unique
  @Column
  email: string;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  password_hash: string;

  @Column(DataType.DATE)
  last_seen: number;

  @Column
  password_reset_token: string;

  @Column
  balance: number;

  @Column
  status: number;

  public toJSON(): any{
    const values = <any>Object.assign({}, this.get());
    delete values.password_hash;
    return values;
  }
}