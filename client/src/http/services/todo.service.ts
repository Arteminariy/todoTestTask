import { AxiosResponse } from "axios";
import api from "..";
import { TodosPaginationResponse } from "../../types";

export class TodoService {
	static getUserTodos(): Promise<AxiosResponse<TodosPaginationResponse>> {
		return api.get<TodosPaginationResponse>('/todos')
	}
}