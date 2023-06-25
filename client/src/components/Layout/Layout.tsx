import { FC } from 'react';
import styles from './Layout.module.scss';
import { Outlet } from 'react-router-dom';

const Layout: FC = () => {
	return (
		<>
			<header className={styles.header}>Тестовое задание</header>
			<main><Outlet/></main>
			<footer className={styles.footer}></footer>
		</>
	);
};

export default Layout;
