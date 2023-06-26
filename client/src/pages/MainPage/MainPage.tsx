import { FC } from 'react';
import styles from './MainPage.module.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import TodoList from './components/TodoList/TodoList';

const MainPage: FC = () => {
	const {isAuth} = useSelector((state: RootState) => state.auth)
	return (
		<div>
			<h1 className={styles.title}>Список дел</h1>
			{isAuth ? (
				<TodoList/>
			) : (
				<>
					<Link className={styles.link} to="/login">
						Войти
					</Link>
					<p>или</p>
					<Link className={styles.link} to="/register">
						Зарегистрироваться
					</Link>
				</>
			)}
		</div>
	);
};

export default MainPage;
