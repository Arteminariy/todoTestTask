import {
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	async login(userDto: CreateUserDto) {
		const user = await this.validateUser(userDto);
		return this.generateToken(user);
	}

	async registration(userDto: CreateUserDto) {
		const candidate = await this.userService.getByLogin(userDto.login);
		if (candidate) {
			throw new HttpException(
				'Пользователь с таким логином уже существует',
				HttpStatus.BAD_REQUEST,
			);
		}
		const hashedPassword = await bcrypt.hash(userDto.password, 5);
		const user = await this.userService.create({
			...userDto,
			password: hashedPassword,
		});
		if (user instanceof HttpException) {
			throw new HttpException(
				'Не удалось зарегистрировать пользователя',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
		return this.generateToken(user);
	}

	private async generateToken(user: User) {
		const payload = { login: user.login, id: user.id, roles: user.roles };
		return { token: this.jwtService.sign(payload) };
	}
	private async validateUser(userDto: CreateUserDto) {
		const user = await this.userService.getByLogin(userDto.login);
		const passwordEquals = await bcrypt.compare(
			userDto.password,
			user.password,
		);
		if (user && passwordEquals) {
			return user;
		}
		throw new UnauthorizedException({
			message: 'Некорректный логин или пароль',
		});
	}
}
