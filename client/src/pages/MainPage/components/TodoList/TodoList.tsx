import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';
import { getTodos } from '../../../../store/slices/todoSlice';
import TodoItem from '../TodoItem/TodoItem';
import styles from './TodoList.module.scss';
import AddTodo from '../AddTodo/AddTodo';

const TodoList: FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(getTodos());
	}, [dispatch]);
	const todos = useSelector((state: RootState) => state.todo.todos);
	return todos.length !== 0 ? (
		<ul className={styles.list}>
			{todos.map((todo) => {
				return <TodoItem todo={todo} />;
			})}
			<AddTodo/>
		</ul>
	) : (
		<p>У вас нет задач</p>
	);
};

export default TodoList;
