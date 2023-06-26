import { FC } from 'react';
import { Todo } from '../../../../types';
import styles from './TodoItem.module.scss';
import { DeleteOutlined } from '@ant-design/icons';

type ITodoItemProps = {
	todo: Todo;
};

const TodoItem: FC<ITodoItemProps> = ({ todo }) => {
	return (
		<li className={styles.item}>
			<input className={styles.checkbox} type="checkbox" name="" id="" />
			<p className={styles.text}>{todo.text}</p>
			<DeleteOutlined style={{ fontSize: '20px', maxHeight: '20px', cursor: 'pointer' }}/>
		</li>
	);
};

export default TodoItem;
