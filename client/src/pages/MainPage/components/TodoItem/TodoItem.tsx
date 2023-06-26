import { FC, useState } from 'react';
import { Todo } from '../../../../types';
import styles from './TodoItem.module.scss';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { AppDispatch } from '../../../../store/store';
import { useDispatch } from 'react-redux';
import {
	checkTodo,
	deleteTodo,
	updateTodo,
} from '../../../../store/slices/todoSlice';
import { Input } from 'antd';

type ITodoItemProps = {
	todo: Todo;
};

const TodoItem: FC<ITodoItemProps> = ({ todo }) => {
	const [checked, setChecked] = useState<boolean>(todo.isDone);
	const [changeForm, setChangeForm] = useState<boolean>(false);
	const [text, setText] = useState<string>(todo.text);

	const dispatch = useDispatch<AppDispatch>();

	const removeTodo = (id: string) => {
		dispatch(deleteTodo(id));
	};

	const toggleTodoChecked = (id: string) => {
		dispatch(checkTodo(id));
	};

	const handleChangeTodo = () => {
		setText(todo.text);
		setChangeForm((prev) => !prev);
	};

	const handleChangeTodoAccept = (id: string, text: string) => {
		dispatch(updateTodo({ id, text }));
		setChangeForm(false)
	};

	return (
		<li className={styles.item}>
			<input
				className={styles.checkbox}
				onClick={() => toggleTodoChecked(todo.id)}
				type="checkbox"
				checked={checked}
				onChange={() => setChecked((prev) => !prev)}
			/>
			{changeForm ? (
				<Input
					className={styles.changeFormInput}
					type="text"
					height="20px"
					placeholder="Переименовать задачу"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
			) : (
				<p className={styles.text}>{todo.text}</p>
			)}

			<span style={{ maxHeight: '20px', gap: '5px', display: 'flex' }}>
				{changeForm ? (
					<CheckOutlined
						onClick={() => handleChangeTodoAccept(todo.id, text)}
						style={{
							fontSize: '20px',
							maxHeight: '20px',
							cursor: 'pointer',
						}}
					/>
				) : (
					<></>
				)}
				<EditOutlined
					onClick={() => {
						handleChangeTodo();
					}}
					style={{
						fontSize: '20px',
						maxHeight: '20px',
						cursor: 'pointer',
					}}
				/>
				<DeleteOutlined
					onClick={() => removeTodo(todo.id)}
					style={{
						fontSize: '20px',
						maxHeight: '20px',
						cursor: 'pointer',
					}}
				/>
			</span>
		</li>
	);
};

export default TodoItem;
