import { Reducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import AuthService from '../../http/services/auth.service';
import { Tokens } from '../../types';

interface Credentials {
	email: string;
	password: string;
}
const initialState = {
	isAuth: false as boolean,
	accessToken: null as string | null,
	refreshToken: null as string | null,
	loading: false as boolean,
	error: null as string | null,
};
export const login = createAsyncThunk(
	'auth/login',
	async ({ email, password }: Credentials): Promise<Tokens> => {
		const response = await AuthService.login({ email, password });
		return response.data;
	}
);

export const register = createAsyncThunk(
	'auth/register',
	async ({ email, password }: Credentials): Promise<Tokens> => {
		const response = await AuthService.registration({ email, password });
		return response.data;
	}
);

export const logout = createAsyncThunk(
	'auth/logout',
	async (): Promise<void> => {
		await AuthService.logout();
	}
);

export const refreshAccessToken = createAsyncThunk<string, string>(
	'auth/refreshAccessToken',
	async (refreshToken) => {
		const response = await axios.post<{ accessToken: string }>(
			`${import.meta.env.VITE_API_URL}/auth/refresh`,
			{ refreshToken }
		);
		return response.data.accessToken;
	}
);
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setError(state, action) {
			state.error = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(login.pending, (state) => {
			state.loading = true;
			state.error = null;
			state.isAuth = false;
			state.accessToken = null;
			state.refreshToken = null;
		});
		builder.addCase(login.fulfilled, (state, action) => {
			state.loading = false;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuth = true;
		});
		builder.addCase(login.rejected, (state, action) => {
			state.loading = false;
			state.error = (action.payload as AxiosError).message;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuth = false;
		});
		builder.addCase(register.pending, (state) => {
			state.loading = true;
			state.error = null;
			state.isAuth = false;
			state.accessToken = null;
			state.refreshToken = null;
		});
		builder.addCase(register.fulfilled, (state, action) => {
			state.loading = false;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuth = true;
		});
		builder.addCase(register.rejected, (state, action) => {
			state.loading = false;
			state.error = (action.payload as AxiosError).message;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuth = false;
		});
		builder.addCase(logout.pending, (state) => {
			state.loading = true;
			state.error = null;
			state.isAuth = false;
		});
		builder.addCase(logout.fulfilled, (state) => {
			state.loading = false;
			state.isAuth = false;
		});
		builder.addCase(logout.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message ?? null;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuth = true;
		});
	},
});
export const { setError } = authSlice.actions;

export const authReducer = authSlice.reducer as Reducer<typeof initialState>;
