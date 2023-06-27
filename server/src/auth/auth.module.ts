import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ATStrategy, RTStrategy } from './strategies';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ATStrategy, RTStrategy],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([User]),
    JwtModule.register({}),
    MailModule,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
