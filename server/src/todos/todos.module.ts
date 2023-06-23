import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { User } from 'src/users/entities/user.entity';
import { Todo } from './entities/todo.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [SequelizeModule.forFeature([User, Todo])],
})
export class TodosModule {}
