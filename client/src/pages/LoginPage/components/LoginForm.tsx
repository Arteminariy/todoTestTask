import { FC, useState } from 'react';
import styles from './LoginForm.module.scss';
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { login, setError } from '../../../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';

const LoginForm: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const [error, setLocalError] = useState<boolean>(false);
	const { loading, isAuth } = useSelector((state: RootState) => state.auth);

	const handleLogin = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		dispatch(login({ email: email, password: password }))
			.then((res) => {
				setError(null);
				navigate('/');
			})
			.catch((err) => {
				setError(err.message);
				setLocalError(true);
			});
	};

	return (
		<div className={styles.container}>
			<h2>Вход</h2>
			{isAuth ? <>
				<p>Вы уже вошли в систему</p>
				<Link className={styles.link} to="/">Главная</Link>
			</> : <Form
				name="normal_login"
				className={styles.loginForm}
				initialValues={{ remember: true }}
				onFinish={handleLogin}
			>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: 'Please input your Email!',
						},
					]}
				>
					<Input
						prefix={
							<UserOutlined className="site-form-item-icon" />
						}
						type="email"
						placeholder="Email"
					/>
				</Form.Item>
				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: 'Please input your Password!',
						},
					]}
				>
					<Input
						prefix={
							<LockOutlined className="site-form-item-icon" />
						}
						type="password"
						placeholder="Password"
					/>
				</Form.Item>
				{error && <Form.Item>Некорректные данные</Form.Item>}
				{loading && <Form.Item>Запрос идет</Form.Item>}
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className={styles.loginFormButton}
					>
						Войти
					</Button>
					или <Link to="/register">Зарегистрироваться</Link>
				</Form.Item>
			</Form>}
		</div>
	);
};

export default LoginForm;
