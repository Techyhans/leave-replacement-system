import {Button, Form, Input} from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import {useNavigate} from "react-router-dom";

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
				console.log(data);
				localStorage.setItem('token', data.access_token);
				navigate('/admin/users')
			})
			.catch(error => console.error('Error:', error));
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<Form
			name="basic"
			labelCol={{span: 2}}
			wrapperCol={{span: 22}}
			initialValues={{remember: true}}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
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

			<Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 8, span: 16}}>
				<Checkbox>Remember me</Checkbox>
			</Form.Item>

			<Form.Item wrapperCol={{offset: 8, span: 16}}>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	)
}
