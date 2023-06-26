import { Todo } from ".";

export interface TodosPaginationResponse {
	count: number;
	rows: Todo[]
}