import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	login(@Body() createUserDto: CreateUserDto) {
		return this.authService.login(createUserDto);
	}

	@Post('registration')
	registration(@Body() createUserDto: CreateUserDto) {
		return this.authService.registration(createUserDto);
	}
}
