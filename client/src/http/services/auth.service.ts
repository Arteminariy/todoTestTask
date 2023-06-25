import { AxiosResponse } from 'axios';
import api from '..';
import { Tokens } from '../../types';

export default class AuthService {
	static async login({
		email,
		password,
	}: {
		email: string;
		password: string;
	}): Promise<AxiosResponse<Tokens>> {
			return api.post<Tokens>('/auth/local/signIn', {
				email,
				password,
			});
	}

	static async registration({
		email,
		password,
	}: {
		email: string;
		password: string;
	}): Promise<AxiosResponse<Tokens>> {
			return api.post<Tokens>('/auth/local/signUp', {
				email,
				password,
			});
	}

	static async logout(): Promise<AxiosResponse<{ message: string }>> {
		return api.post<{ message: string }>('/auth/logout');
	}
}
