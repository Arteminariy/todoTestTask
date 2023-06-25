import { Reducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define an interface for the credentials
interface Credentials {
	email: string;
	password: string;
}

// Define an interface for the tokens
interface Tokens {
	accessToken: string;
	refreshToken: string;
}

// Define the initial state of the auth slice
const initialState = {
	accessToken: null as string | null,
	refreshToken: null as string | null,
	loading: false as boolean,
	error: null as string | null,
};

// Create an async thunk for getting the tokens from the server
export const getTokens = createAsyncThunk<Tokens, Credentials>(
	'auth/getTokens',
	async (credentials) => {
		// Make a POST request to the server with the credentials
		const response = await axios.post<Tokens>(
			`${import.meta.env.VITE_API_URL}/auth/local/signIn`,
			credentials
		);
		// Return the tokens from the response data
		return response.data;
	}
);

export const registerUser = createAsyncThunk<Tokens, Credentials>(
	'auth/registerUser',
	async (credentials) => {
		// Make a POST request to the server with the credentials
		const response = await axios.post<Tokens>(
			`${import.meta.env.VITE_API_URL}/auth/local/signUp`,
			credentials
		);
		// Return the tokens from the response data
		return response.data;
	}
);

// Create an async thunk for refreshing the access token using the refresh token
export const refreshAccessToken = createAsyncThunk<string, string>(
	'auth/refreshAccessToken',
	async (refreshToken) => {
		// Make a POST request to the server with the refresh token
		const response = await axios.post<{ accessToken: string }>(
			`${import.meta.env.VITE_API_URL}/auth/refresh`,
			{ refreshToken }
		);
		// Return the new access token from the response data
		return response.data.accessToken;
	}
);
// Create a slice for the auth feature
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Add any other reducers you need here
	},
	extraReducers: (builder) => {
		// Handle the pending state of the getTokens action
		builder.addCase(getTokens.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		// Handle the fulfilled state of the getTokens action
		builder.addCase(getTokens.fulfilled, (state, action) => {
			state.loading = false;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
		});
		// Handle the rejected state of the getTokens action
		builder.addCase(getTokens.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message ?? null;
			state.accessToken = null;
			state.refreshToken = null;
		});
		// Handle the pending state of the refreshAccessToken action
		builder.addCase(refreshAccessToken.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		// Handle the fulfilled state of the refreshAccessToken action
		builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
			state.loading = false;
			state.accessToken = action.payload;
		});
		// Handle the rejected state of the refreshAccessToken action
		builder.addCase(refreshAccessToken.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message ?? null;
			state.accessToken = null;
			state.refreshToken = null;
		});
		builder.addCase(registerUser.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		// Handle the fulfilled state of the registerUser action
		builder.addCase(registerUser.fulfilled, (state, action) => {
			state.loading = false;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
		});
		// Handle the rejected state of the registerUser action
		builder.addCase(registerUser.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message ?? null;
			state.accessToken = null;
			state.refreshToken = null;
		});
	},
});

// Export the auth reducer and any actions you need
export const authReducer = authSlice.reducer as Reducer<typeof initialState>;
