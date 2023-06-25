import { FC } from 'react';
import styles from './MainPage.module.scss';
import { Link } from 'react-router-dom';

const MainPage: FC = () => {
	return (
		<div>
			<h1 className={styles.title}>Список дел</h1>
      <Link className={styles.link} to='/login'>Войти</Link>
      <p>или</p>
      <Link className={styles.link} to='/register'>Зарегистрироваться</Link>
		</div>
	);
};

export default MainPage;
