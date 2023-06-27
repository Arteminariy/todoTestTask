import { AxiosResponse } from "axios";
import api from "..";
import { Todo, TodosPaginationResponse } from "../../types";

export class TodoService {
	static getUserTodos({limit, offset}: {limit: number, offset: number}): Promise<AxiosResponse<TodosPaginationResponse>> {
		return api.get<TodosPaginationResponse>(`/todos?limit=${limit}&offset=${offset}`)
	}
	static createTodo(text: string): Promise<AxiosResponse<Todo>> {
		return api.post<Todo>('/todos', { text })
	}
	static deleteTodo(id: string): Promise<AxiosResponse<{ message: string, id: string }>> {
		return api.delete<{ message: string, id: string }>(`/todos/${id}`)
	}
	static checkTodo(id: string): Promise<AxiosResponse<Todo>> {
		return api.patch<Todo>(`/todos/check/${id}`)
	}
	static updateTodo(id: string, text: string): Promise<AxiosResponse<Todo>> {
		return api.patch<Todo>(`/todos/${id}`, { text: text })
	}
}