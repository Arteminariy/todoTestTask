import { Route, Routes } from 'react-router-dom';
import './App.scss';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import MainPage from './pages/MainPage/MainPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Layout from './components/Layout/Layout';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import { checkAuth, setTokens } from './store/slices/authSlice';

function App() {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		if (localStorage.getItem('refreshToken')) {
			dispatch(
				setTokens({
					refreshToken: localStorage.getItem('refreshToken')!,
					accessToken: localStorage.getItem('accessToken')!,
				})
			);
			dispatch(checkAuth());
		}
	}, []);

	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<MainPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
