import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetCurrentUserId } from 'src/auth/decorators';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateTodoDto } from './dto/update-todo.dto';

@ApiTags('Todo')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Создание задачи' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Задача создана',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при создании задачи',
  })
  create(
    @Body() createTodoDto: CreateTodoDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.todosService.create(createTodoDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех задач' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Задачи получены',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Не удалось получить задачи',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при получении задач',
  })
  findAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @GetCurrentUserId() userId: string,
  ) {
    return this.todosService.findAllByUserId(limit, offset, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение задачи' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Задача получены',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Не удалось получить задачу',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при получении задачи',
  })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch('check/:id')
  @ApiOperation({ summary: 'Изменение статуса задачи' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Задача изменена',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Задача c id: ${id} не найдена',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при изменении задачи',
  })
  check(@Param('id') id: string) {
    return this.todosService.check(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Изменение задачи' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Задача изменена',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Задача c id: ${id} не найдена',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при изменении задачи',
  })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Изменение задачи' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Задача удалена',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Задача c id: ${id} не найдена',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при удалении задачи',
  })
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
