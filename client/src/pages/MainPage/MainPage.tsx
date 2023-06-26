import { FC } from 'react';
import styles from './MainPage.module.scss';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import TodoList from './components/TodoList/TodoList';
import { Button } from 'antd';
import { logout } from '../../store/slices/authSlice';

const MainPage: FC = () => {
	const { isAuth } = useSelector((state: RootState) => state.auth);

	const dispatch = useDispatch<AppDispatch>();

	const handleLogout = () => {
		dispatch(logout())
	}

	return (
		<div>
			<h1 className={styles.title}>Список дел</h1>
			{isAuth ? (
				<>
					<TodoList />
					<Button className={styles.logout} type="primary" danger onClick={handleLogout}>Выйти из аккаунта</Button>
				</>
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
