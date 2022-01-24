
import {Table, Tag, Space, Form, Input, Button} from 'antd';
import {useEffect, useState} from "react";
import Modal from "antd/es/modal/Modal";

export const UserPage = () => {

	const [userList, setUserList] = useState([]);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			render: text => <a>{text}</a>,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Full Name',
			dataIndex: 'full_name',
			key: 'full_name',
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'Gender',
			dataIndex: 'gender',
			key: 'gender',
		},
		{
			title: 'Status',
			dataIndex: 'is_active',
			key: 'is_active',
			render: is_active => (
				<>
					<Tag color={is_active ? 'green' : 'red'} >
						{ is_active ? "Active" : "Inactive" }
					</Tag>
				</>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (rowData) => (
				<Space size="middle">
					<a>Schedule</a>
					<a>Edit</a>
					<a>Delete</a>
				</Space>
			),
		},
	];

	const showCreateModal = () => {
		setIsCreateModalVisible(true);
	};

	const handleCreateOk = () => {
		setIsEditModalVisible(false);
	};

	const handleCreateCancel = () => {
		setIsEditModalVisible(false);
	};

	const showEditModal = () => {
		setIsEditModalVisible(true);
	};

	const handleEditOk = () => {
		setIsEditModalVisible(false);
	};

	const handleEditCancel = () => {
		setIsEditModalVisible(false);
	};

	const showDeleteModal = () => {
		setIsDeleteModalVisible(true);
	};

	const handleDeleteOk = () => {
		fetch('/api/users/' + selectedUser.id, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			}

		})
			.then(res => res.json())
			.then(data => {
				alert("Deleted")
				setIsDeleteModalVisible(false);
				getUserList();
			})
			.catch(err => console.log(err));
	};

	const handleDeleteCancel = () => {
		setIsDeleteModalVisible(false);
	};

	const onEditFinish = (values) => {
		console.log(values);

		// fetch('/api/users/' + selectedUser.id, {
		// 	method: 'PUT',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: 'Bearer ' + localStorage.getItem('token'),
		// 	},
		// 	body: JSON.stringify({
		// 		code: values.code,
		// 		name: values.name
		// 	})
		//
		// })
		// 	.then(res => res.json())
		// 	.then(data => {
		// 		alert("Updated")
		// 		setIsEditModalVisible(false);
		// 		getSubjectList();
		// 	})
		// 	.catch(err => console.log(err));
	};

	const onEditFailed = (error) => {
		console.log(error);
	};

	const onCreateFinish = (values) => {
		console.log(values);

		// fetch('/api/subjects/', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: 'Bearer ' + localStorage.getItem('token'),
		// 	},
		// 	body: JSON.stringify({
		// 		code: values.code,
		// 		name: values.name
		// 	})
		//
		// })
		// 	.then(res => res.json())
		// 	.then(data => {
		// 		alert("Created")
		// 		setIsCreateModalVisible(false);
		// 		getSubjectList();
		// 	})
		// 	.catch(err => console.log(err));
	};

	const onCreateFailed = (error) => {
		console.log(error);
	};

	const getUserList = () => {
		fetch('/api/users/?skip=0&limit=100', {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
				method: 'GET'
			},
		})
			.then(res => res.json())
			.then(data => {
				setUserList(data);
			})
			.catch(err => console.log(err));
	}

	useEffect(() => {
		getUserList();
	}, [])

	return (
		<>
			<Button type="primary" htmlType="button" onClick={showCreateModal}>
				Create User
			</Button>

			<Table columns={columns} dataSource={userList} />

			<Modal title="Create" visible={isCreateModalVisible} onOk={handleCreateOk} onCancel={handleCreateCancel}>
				<Form
					name="basic"
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					// initialValues={{
					// 	name: selectedSubject.name,
					// 	code: selectedSubject.code,
					// }}
					onFinish={onCreateFinish}
					onFinishFailed={onCreateFailed}
					autoComplete="off"
				>
					<Form.Item
						label="Subject Name"
						name="name"
						rules={[{ required: true, message: 'Please input name!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Subject Code"
						name="code"
						rules={[{ required: true, message: 'Please input code!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 6, span: 18 }}>
						<Button type="primary" htmlType="submit">
							Create
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			<Modal title="Edit" visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
				<Form
					name="basic"
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					// initialValues={{
					// 	name: selectedSubject.name,
					// 	code: selectedSubject.code,
					// }}
					onFinish={onEditFinish}
					onFinishFailed={onEditFailed}
					autoComplete="off"
				>
					<Form.Item
						label="Subject Name"
						name="name"
						rules={[{ required: true, message: 'Please input name!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Subject Code"
						name="code"
						rules={[{ required: true, message: 'Please input code!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 6, span: 18 }}>
						<Button type="primary" htmlType="submit">
							Edit
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			<Modal title="Delete" visible={isDeleteModalVisible} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
				<p>Are you sure want to delete ?</p>
			</Modal>
		</>
	)
}
