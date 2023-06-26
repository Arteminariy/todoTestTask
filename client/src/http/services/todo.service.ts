import { AxiosResponse } from "axios";
import api from "..";
import { Todo, TodosPaginationResponse } from "../../types";

export class TodoService {
	static getUserTodos(): Promise<AxiosResponse<TodosPaginationResponse>> {
		return api.get<TodosPaginationResponse>('/todos')
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
}