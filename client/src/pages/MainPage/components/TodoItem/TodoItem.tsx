import { FC, useState } from 'react';
import { Todo } from '../../../../types';
import styles from './TodoItem.module.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { AppDispatch } from '../../../../store/store';
import { useDispatch } from 'react-redux';
import { checkTodo, deleteTodo } from '../../../../store/slices/todoSlice';

type ITodoItemProps = {
	todo: Todo;
};

const TodoItem: FC<ITodoItemProps> = ({ todo }) => {

	const [checked, setChecked] = useState<boolean>(todo.isDone);
	
	const dispatch = useDispatch<AppDispatch>()
	
	const removeTodo = (id: string) => {
		dispatch(deleteTodo(id))
	}

	const toggleTodoChecked = (id: string) => {
		dispatch(checkTodo(id))
	}

	return (
		<li className={styles.item}>
			<input className={styles.checkbox} onClick={() => toggleTodoChecked(todo.id)} type="checkbox" checked={checked} onChange={() => setChecked(prev => !prev)} />
			<p className={styles.text}>{todo.text}</p>
			<DeleteOutlined onClick={() => removeTodo(todo.id)} style={{ fontSize: '20px', maxHeight: '20px', cursor: 'pointer' }}/>
		</li>
	);
};

export default TodoItem;
