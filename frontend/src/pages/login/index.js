import {Button, Form, Input} from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import {useNavigate} from "react-router-dom";

import "./index.css";

export const Login = () => {

	const navigate = useNavigate()

	const onFinish = (values) => {
		console.log('Success:', values);

		const formData = new FormData();
		formData.append('username', values.username);
		formData.append('password', values.password);

		fetch('api/login/access-token', {
			method: 'POST',
			body: formData
		}).then(response => response.json())
			.then(data => {
				localStorage.setItem('token', data.access_token);
				localStorage.setItem('is_admin', values.username === "admin@example.com" ? true : false);
				navigate('/admin/users')
			})
			.catch(error => console.error('Error:', error));
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<div className={"center"}>

			<Form
				name="basic"
				labelCol={{span: 2}}
				wrapperCol={{span: 22}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<center>
					<img src={require("../../assets/logo.jpeg")} style={{ width: "10vw" }} alt={"logo"}/>
					<h1>Sekolah Kebangsaan Mantin</h1>
				</center>

				<br />
				<br />
				<Form.Item
					label="Username"
					name="username"
					rules={[{required: true, message: 'Please input your username!'}]}
				>
					<Input/>
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[{required: true, message: 'Please input your password!'}]}
				>
					<Input.Password/>
				</Form.Item>

				<center>
					<Button type="primary" htmlType="submit">
						Login
					</Button>
				</center>
			</Form>
		</div>
	)
}
