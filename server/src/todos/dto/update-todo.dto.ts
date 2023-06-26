import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsBoolean({ message: 'Должно быть логическим типом' })
  @ApiPropertyOptional({ description: 'Выполнена ли задача' })
  isDone?: boolean;
}
