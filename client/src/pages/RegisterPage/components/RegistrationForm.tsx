import { FC, FormEvent, useState } from 'react';
import styles from './RegistrationForm.module.scss';
import { Button, Checkbox, Form, Input } from 'antd';
import {
	EyeInvisibleOutlined,
	EyeTwoTone,
	LockOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { getTokens, registerUser } from '../../../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationForm: FC = () => {
	const nav = useNavigate();

	const dispatch = useDispatch();

	const handleLogin = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Get the email and password from the form inputs
		const email = event.currentTarget.email.value;
		const password = event.currentTarget.password.value;
		// Dispatch the getTokens action with the credentials
		dispatch(getTokens({ email, password }));
	};

	const handleRegister = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Get the email and password from the form inputs
		const email = event.currentTarget.email.value;
		const password = event.currentTarget.password.value;
		const confirmPassword = event.currentTarget.confirmPassword.value;
		// Check if the password and confirm password match
		if (password === confirmPassword) {
			// Dispatch the registerUser action with the credentials
			dispatch(registerUser({ email, password }));
		} else {
			// Show an error message if they don't match
			alert('Пароли не совпадают');
		}
	};

	const onFinish = (values: any) => {
		console.log('Received values of form: ', values);
	};

	return (
		<div className={styles.container}>
			<h2>Регистрация</h2>
			<Form
				name="normal_login"
				className={styles.loginForm}
				initialValues={{ remember: true }}
				onFinish={onFinish}
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
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className={styles.loginFormButton}
					>
						Log in
					</Button>
					Or <a href="">register now!</a>
				</Form.Item>
			</Form>
		</div>
	);
};

export default RegistrationForm;
