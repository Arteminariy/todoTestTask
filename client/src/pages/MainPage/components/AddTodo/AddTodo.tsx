import { FC, useState } from 'react';
import styles from './AddTodo.module.scss';
import { CloseOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { createTodo } from '../../../../store/slices/todoSlice';

const AddTodo: FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const [todoForm, setTodoForm] = useState<boolean>(false);
	const [todo, setTodo] = useState<string>('');

	const toggleAddForm = () => {
		setTodoForm((prev) => !prev);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		setTodo(prev => prev = '')
	};

	const handleAddTodo = () => {
		dispatch(createTodo(todo))
		setTodoForm((prev) => !prev);
	};

	return (
		<>
			{todoForm ? (
				<div className={styles.form}>
					<Input height='40px' placeholder='Добавить задачу' value={todo} onChange={(e) => setTodo(e.target.value)} onPressEnter={handleAddTodo}/>
					<span className={styles.iconContainer}><PlusCircleOutlined onClick={handleAddTodo} style={{ fontSize: '24px', cursor: 'pointer' }} /></span>
					<span className={styles.iconContainer}><CloseOutlined onClick={toggleAddForm} style={{ fontSize: '24px', cursor: 'pointer' }} /></span>
				</div>
			) : (
				<li className={styles.addTodo} onClick={toggleAddForm}>
					<PlusOutlined
						style={{ fontSize: '20px', maxHeight: '20px' }}
					/>
					Добавить задачу
				</li>
			)}
		</>
	);
};

export default AddTodo;
