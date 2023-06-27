import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  HttpException,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto } from './dto/';
import { Tokens } from './interfaces';
import { ATGuard, RTGuard } from './guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './decorators';
import { UsersService } from 'src/users/users.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @Post('local/signUp')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Пользователь с таким email уже существует',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Не удалось создать пользователя',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при регистрации',
  })
  signUpLocal(@Body() authDto: AuthDto): Promise<Tokens | HttpException> {
    return this.authService.signUpLocal(authDto);
  }

  @Public()
  @Post('local/signIn')
  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Указан неверный пароль',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при входе',
  })
  async signInLocal(@Body() authDto: AuthDto): Promise<Tokens | HttpException> {
    const result = await this.authService.signInLocal(authDto);
    if (result instanceof HttpException) {
      throw result;
    }
    return result;
  }

  @UseGuards(ATGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiParam({ name: 'userId', description: 'Идентификатор пользователя' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Выход из системы совершён успешно',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при выходе из системы',
  })
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RTGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiQuery({ name: 'refreshToken', description: 'Токен обновления' })
  @ApiParam({ name: 'userId', description: 'Идентификатор пользователя' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Указан неверный Refresh Token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка при получении токенов',
  })
  refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Public()
  @Get('activate/:id')
  activateUser(@Param('id') id: string) {
    return this.userService.activateUser(id);
  }
}
