import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';
import { getTodos } from '../../../../store/slices/todoSlice';
import TodoItem from '../TodoItem/TodoItem';
import styles from './TodoList.module.scss';
import AddTodo from '../AddTodo/AddTodo';

const TodoList: FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	const todos = useSelector((state: RootState) => state.todo.todos);

	useEffect(() => {
		dispatch(getTodos());
	}, []);

	return (
		<ul className={styles.list}>
			{todos.length !== 0 ? (
				<>
					{todos.map((todo) => {
						return <TodoItem todo={todo} />;
					})}
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
