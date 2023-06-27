import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';
import { getTodos } from '../../../../store/slices/todoSlice';
import TodoItem from '../TodoItem/TodoItem';
import styles from './TodoList.module.scss';
import AddTodo from '../AddTodo/AddTodo';
import { Pagination } from 'antd';

const TodoList: FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	const todos = useSelector((state: RootState) => state.todo.rows);
	const count = useSelector((state: RootState) => state.todo.count);
	const page = useSelector((state: RootState) => state.todo.page);

	useEffect(() => {
		const limit = 5;
		const offset = (page - 1) * limit;
		dispatch(getTodos({ limit, offset }));
	}, [dispatch, page, todos.length]);

	const handlePageChange = (newPage: number) => {
		const limit = 5;
		const offset = (newPage - 1) * limit;
		dispatch(getTodos({ limit, offset }));
	};

	return (
		<ul className={styles.list}>
			{todos.length !== 0 ? (
				<>
					{todos.map((todo) => {
						return <TodoItem todo={todo} />;
					})}
					{count > 5 && (
						<Pagination
							current={page}
							total={count}
							pageSize={5}
							onChange={handlePageChange}
						/>
					)}
					<AddTodo />
				</>
			) : (
				<>
					<p>У вас нет задач</p>
					<AddTodo />
				</>
			)}
		</ul>
	);
};

export default TodoList;
