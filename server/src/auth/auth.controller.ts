import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/';
import { Tokens } from './interfaces';
import { ATGuard, RTGuard } from './guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './decorators';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signUp')
  @HttpCode(HttpStatus.OK)
  signUpLocal(@Body() authDto: AuthDto): Promise<Tokens | HttpException> {
    return this.authService.signUpLocal(authDto);
  }

  @Public()
  @Post('local/signIn')
  @HttpCode(HttpStatus.CREATED)
  signInLocal(@Body() authDto: AuthDto): Promise<Tokens | HttpException> {
    return this.authService.signInLocal(authDto);
  }

  @UseGuards(ATGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RTGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
