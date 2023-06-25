import { AxiosResponse } from "axios";
import api from "..";
import { Todo } from "../../types";

export class TodoService {
	static getUserTodos(): Promise<AxiosResponse<Todo[]>> {
		return api.get<Todo[]>('/todos')
	}
}