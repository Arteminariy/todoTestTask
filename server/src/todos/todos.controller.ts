import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetCurrentUserId } from 'src/auth/decorators';
import { ApiTags } from '@nestjs/swagger';
import { UpdateTodoDto } from './dto/update-todo.dto';

@ApiTags('Todo')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.todosService.create(createTodoDto, userId);
  }

  @Get()
  findAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @GetCurrentUserId() userId: string,
  ) {
    return this.todosService.findAllByUserId(limit, offset, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch('check/:id')
  check(@Param('id') id: string) {
    return this.todosService.check(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
