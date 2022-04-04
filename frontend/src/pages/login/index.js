import {Button, Form, Input} from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import {useNavigate} from "react-router-dom";

import "./index.css";

export const Login = () => {

	const navigate = useNavigate()

	const onFinish = (values) => {

		const formData = new FormData();
		formData.append('username', values.username);
		formData.append('password', values.password);

		fetch('api/login/access-token', {
			method: 'POST',
			body: formData
		}).then(response => {
			if (response.status === 400) {
				alert("invalid credentials")
			} else {
				response.json().then((data) => {
					console.log("TOKEN", data)
					localStorage.setItem('token', data.access_token);
					localStorage.setItem('is_admin', values.username === "admin@example.com" ? true : false);
					if (values.username === "admin@example.com") {
						navigate('/admin/users')
					} else {
						navigate('/user/dashboard')
					}
				})
			}
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
				<h3>Email</h3>
				<Form.Item
					name="username"
					rules={[{required: true, message: 'Please input your email!'}]}
				>
					<Input/>
				</Form.Item>

				<h3>Password</h3>
				<Form.Item
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
