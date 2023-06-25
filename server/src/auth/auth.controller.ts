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
  signUpLocal(@Body() authDto: AuthDto): Promise<Tokens | HttpException> {
    return this.authService.signUpLocal(authDto);
  }

  @Public()
  @Post('local/signIn')
  async signInLocal(@Body() authDto: AuthDto): Promise<Tokens | HttpException> {
    const result = await this.authService.signInLocal(authDto);
    if (result instanceof HttpException) {
      throw result;
    }
    return result;
  }

  @UseGuards(ATGuard)
  @Post('logout')
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RTGuard)
  @Post('refresh')
  refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
