import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
interface UserAttributes {
  id: string;
  username: string;
  email: string;
  pass: string;
  birthYear: Date;
  role: Role;
}
type UserCreationAttributes = Optional<UserAttributes, 'id'>;

@Table
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare pass: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare birthYear: Date;

  @Column({
    type: DataType.ENUM('admin', 'user'),
    defaultValue: 'user',
  })
  declare role: Role;
}
