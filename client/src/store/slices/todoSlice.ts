import {
	Reducer,
	createAsyncThunk,
	createSlice,
} from '@reduxjs/toolkit';
import { Todo, TodosPaginationResponse } from '../../types';
import { AxiosError } from 'axios';
import { TodoService } from '../../http/services/todo.service';

const initialState = {
	page: 1 as number,
	count: 0 as number,
	rows: [] as Todo[],
	loading: false as boolean,
	error: null as string | null,
};

export const getTodos = createAsyncThunk(
	'todo/getTodos',
	async ({limit, offset}: {limit: number, offset: number}): Promise<TodosPaginationResponse> => {
		const response = await TodoService.getUserTodos({limit, offset});
		return response.data;
	}
);

export const createTodo = createAsyncThunk(
	'todo/createTodo',
	async (text: string): Promise<Todo> => {
		const response = await TodoService.createTodo(text);
		return response.data;
	}
);

export const deleteTodo = createAsyncThunk(
	'todo/deleteTodo',
	async (id: string): Promise<{ message: string; id: string }> => {
		const response = await TodoService.deleteTodo(id);
		return response.data;
	}
);

export const checkTodo = createAsyncThunk(
	'todo/checkTodo',
	async (id: string): Promise<Todo> => {
		const response = await TodoService.checkTodo(id);
		return response.data;
	}
);

export const updateTodo = createAsyncThunk(
	'todo/updateTodo',
	async ({ id, text }: { id: string; text: string }): Promise<Todo> => {
		const response = await TodoService.updateTodo(id, text);
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
		setPage(state, action) {
			state.page = action.payload;
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
			state.page = action.meta.arg.offset / action.meta.arg.limit + 1;
			state.count = action.payload.count;
			state.rows = action.payload.rows;
		});
		builder.addCase(getTodos.rejected, (state, action) => {
			state.loading = false;
			state.error = (action.payload as AxiosError).message;
			state.page = 1;
			state.count = 0;
			state.rows = [];
		});
		builder.addCase(createTodo.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(createTodo.fulfilled, (state, action) => {
			state.loading = false;
			state.error = null;
			state.rows.push(action.payload);
		});
		builder.addCase(createTodo.rejected, (state, action) => {
			state.loading = false;
			state.error = (action.payload as AxiosError).message;
		});
		builder.addCase(updateTodo.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(updateTodo.fulfilled, (state, action) => {
			state.loading = false;
			state.error = null;
			const index = state.rows.findIndex(
				(todo) => todo.id === action.payload.id
			);
			if (index > -1) {
				state.rows[index] = action.payload;
			}
		});
		builder.addCase(updateTodo.rejected, (state, action) => {
			state.loading = false;
			state.error = (action.payload as AxiosError).message;
		});
		builder.addCase(deleteTodo.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(deleteTodo.fulfilled, (state, action) => {
			state.loading = false;
			state.error = null;
			state.rows = state.rows.filter(
				(todo) => todo.id !== action.payload.id
			);
		});
		builder.addCase(deleteTodo.rejected, (state, action) => {
			state.loading = false;
			state.error = (action.payload as AxiosError).message;
		});
	},
});
export const { setError, setPage } = todoSlice.actions;

export const todoReducer = todoSlice.reducer as Reducer<typeof initialState>;
