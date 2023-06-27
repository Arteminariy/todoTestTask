import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { User } from './users/entities/user.entity';
import { Todo } from './todos/entities/todo.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ATGuard } from './auth/guards';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      models: [User, Todo],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    TodosModule,
    AuthModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ATGuard,
    },
  ],
})
export class AppModule {}
