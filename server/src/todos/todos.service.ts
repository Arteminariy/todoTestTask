import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo) private todoRepository: typeof Todo) {}

  async create(
    createTodoDto: CreateTodoDto,
    userId: string,
  ): Promise<Todo | HttpException> {
    try {
      const todo = await this.todoRepository.create({
        ...createTodoDto,
        userId,
        isDone: false,
      });
      if (!todo) {
        throw new HttpException(
          'Ошибка при создании задачи',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return todo;
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании задачи',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findAllByUserId(
    limit: number,
    offset: number,
    userId: string,
  ): Promise<{ count: number; rows: Todo[] } | HttpException> {
    try {
      const { count, rows } = await this.todoRepository.findAndCountAll({
        where: { userId },
        limit: limit,
        offset: offset,
        include: { all: true },
      });
      if (!rows) {
        throw new HttpException(
          `Не удалось получить задачи`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { count, rows };
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении задачи',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async findOne(id: string): Promise<Todo | HttpException> {
    try {
      const todo = await this.todoRepository.findByPk(id);
      if (!todo) {
        throw new HttpException(
          `Не удалось получить задачу`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return todo;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении задачу',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async check(id: string): Promise<Todo | HttpException> {
    try {
      const todo = await this.todoRepository.findByPk(id);
      if (!todo) {
        throw new HttpException(
          `Задача c id: ${id} не найдена`,
          HttpStatus.NOT_FOUND,
        );
      }
      const isDone = !todo.isDone;
      await todo.update({ isDone: isDone });
      return todo;
    } catch (error) {
      throw new HttpException(
        'Ошибка при изменении задачи',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo | HttpException> {
    try {
      const todo = await this.todoRepository.findByPk(id);
      if (!todo) {
        throw new HttpException(
          `Задача c id: ${id} не найдена`,
          HttpStatus.NOT_FOUND,
        );
      }
      await todo.update(updateTodoDto);
      return todo;
    } catch (error) {
      throw new HttpException(
        'Ошибка при изменении задачи',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async remove(
    id: string,
  ): Promise<{ message: string; id: string } | HttpException> {
    try {
      const todo = await this.todoRepository.findByPk(id);
      if (!todo) {
        throw new HttpException(
          `Задача c id: ${id} не найдена`,
          HttpStatus.NOT_FOUND,
        );
      }
      await todo.destroy();
      return { message: `Задача с id: ${id} удален`, id: id };
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении задачи',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
