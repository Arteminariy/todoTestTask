import { Reducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Todo, TodosPaginationResponse } from '../../types';
import { AxiosError } from 'axios';
import { TodoService } from '../../http/services/todo.service';

const initialState = {
	todos: [] as Todo[],
	loading: false as boolean,
	error: null as string | null,
};

export const getTodos = createAsyncThunk(
	'todo/getTodos',
	async (): Promise<TodosPaginationResponse> => {
		const response = await TodoService.getUserTodos();
		return response.data;
	}
);

const todoSlice = createSlice({
	name: 'todo',
	initialState,
	reducers: {
		setError(state, action) {
			state.error = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getTodos.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(getTodos.fulfilled, (state, action) => {
			state.loading = false;
			state.error = null;
			state.todos = action.payload.rows;
		});
		builder.addCase(getTodos.rejected, (state, action) => {
			state.loading = false;
			state.error = (action.payload as AxiosError).message;
			state.todos = [];
		});
	},
});
export const { setError } = todoSlice.actions;

export const todoReducer = todoSlice.reducer as Reducer<typeof initialState>;
