import {Button, DatePicker, Form, Input, notification, Select, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import Modal from "antd/es/modal/Modal";
import {momentLocalizer} from "react-big-calendar";
import moment from "moment";
import axios from "axios";

export const UserLeavePage = () => {

	const [loading, setLoading] = useState(false);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const showCreateModal = () => {
		setIsCreateModalVisible(true);
	};

	const handleCreateOk = () => {
		setIsCreateModalVisible(false);
	};

	const getLeaveList = () => {
		fetch('/api/leaves/me', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			}

		})
			.then(res => res.json())
			.then(data => {
				setDataSource(data)
			})
			.catch(err => console.log(err));
	}

	const onCreateFinish = (values) => {
		setLoading(true);
		values.date = values.date.format('YYYY-MM-DD');
		values.approved = false;

		axios
			.post('/api/leaves/', values, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				}
			}).then(resp => {
				notification["success"]({
					message: 'Success',
					description:
						'Leave Applied Successfully',
				});
				getLeaveList();
			})
			.catch(err => console.log(err))
			.finally(() => setLoading(false));
	};

	const onCreateFailed = (error) => {
		console.log(error);
	};

	const handleCreateCancel = () => {
		setIsCreateModalVisible(false);
	};

	useEffect(() => {
		getLeaveList()
	}, [])

	const columns = [
		{
			title: 'Id',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Approved',
			dataIndex: 'approved',
			key: 'approved',
			render: (text, record) => (
				<span>
					{record.approved ? 'Yes' : 'No'}
				</span>
			),
		},
	];

	return (
		<>
			<Button type="primary" htmlType="button" onClick={showCreateModal}>
				Apply Leave
			</Button>

			<Table dataSource={dataSource} columns={columns} />

			<Modal title="Apply Leave" visible={isCreateModalVisible} onOk={handleCreateOk} onCancel={handleCreateCancel} footer={null}>
				<Form
					name="basic"
					labelCol={{span: 6}}
					wrapperCol={{span: 18}}
					onFinish={onCreateFinish}
					onFinishFailed={onCreateFailed}
					autoComplete="off"
				>
					<Form.Item
						label="date"
						name="date"
						rules={[{required: true, message: 'Date is required'}]}
					>
						<DatePicker />
					</Form.Item>

					<Form.Item
						label="description"
						name="description"
						rules={[{required: true, message: 'Description is required'}]}
					>
						<Input />
					</Form.Item>

					{
						loading ? <Spin /> : (
							<Form.Item wrapperCol={{offset: 6, span: 18}}>
								<Button type="primary" htmlType="submit">
									Apply
								</Button>
							</Form.Item>
						)
					}
				</Form>
			</Modal>
		</>
	);
}
