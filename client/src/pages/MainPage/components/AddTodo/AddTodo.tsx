import { FC } from 'react';
import styles from './AddTodo.module.scss';
import { PlusOutlined } from '@ant-design/icons';

const AddTodo: FC = () => {
	return (
		<li className={styles.addTodo}>
			<PlusOutlined style={{ fontSize: '20px', maxHeight: '20px' }} />
			Добавить задачу
		</li>
	);
};

export default AddTodo;
