import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		forwardRef(() => UserModule),
		JwtModule.register({
			secret: process.env.JWT_KEY || 'Secret',
			signOptions: {
				expiresIn: '24h',
			},
		}),
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
