import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';

@Table({ tableName: 'todos' })
export class Todo extends Model<Todo> {
  @ApiProperty({ description: 'ID задачи', example: 'UUID' })
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Текст задачи', example: 'Сделать задание' })
  @Column({
    type: DataType.STRING,
  })
  text: string;

  @ApiProperty({ description: 'Выполнено ли задание', example: 'true' })
  @Column({
    type: DataType.BOOLEAN,
  })
  isDone: boolean;

  @ApiProperty({ description: 'ID пользователя', example: 'UUID' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
