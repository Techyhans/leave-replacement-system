
import {Table, Tag, Space, Form, Input, Button} from 'antd';
import {useEffect, useState} from "react";
import Modal from "antd/es/modal/Modal";

export const SubjectPage = () => {

	const [subjectList, setSubjectList] = useState([]);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [selectedSubject, setSelectedSubject] = useState({});

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			render: text => <a>{text}</a>,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Code',
			dataIndex: 'code',
			key: 'code',
		},
		// {
		// 	title: 'Action',
		// 	key: 'action',
		// 	render: (rowData) => (
		// 		<Space size="middle">
		// 			<a onClick={
		// 				() => {
		// 					setSelectedSubject(rowData);
		// 					setIsEditModalVisible(true);
		// 				}
		// 			}>Edit</a>
		// 			<a onClick={
		// 				() => {
		// 					setSelectedSubject(rowData);
		// 					setIsDeleteModalVisible(true);
		// 				}
		// 			}>Delete</a>
		// 		</Space>
		// 	),
		// },
	];

	const showCreateModal = () => {
		setIsCreateModalVisible(true);
	};

	const handleCreateOk = () => {
		setIsCreateModalVisible(false);
	};

	const handleCreateCancel = () => {
		setIsCreateModalVisible(false);
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
		fetch('/api/subjects/' + selectedSubject.id, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			}

		})
			.then(res => res.json())
			.then(data => {
				alert("Deleted")
				setIsDeleteModalVisible(false);
				getSubjectList();
			})
			.catch(err => console.log(err));
		setIsDeleteModalVisible(false);
	};

	const handleDeleteCancel = () => {
		setIsDeleteModalVisible(false);
	};

	const onEditFinish = (values) => {
		console.log(values);

		fetch('/api/subjects/' + selectedSubject.id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			body: JSON.stringify({
				code: values.code,
				name: values.name
			})

		})
			.then(res => res.json())
			.then(data => {
				alert("Updated")
				setIsEditModalVisible(false);
				getSubjectList();
			})
			.catch(err => console.log(err));
	};

	const onEditFailed = (error) => {
		console.log(error);
	};

	const onCreateFinish = (values) => {
		console.log(values);

		fetch('/api/subjects/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			body: JSON.stringify({
				code: values.code,
				name: values.name
			})

		})
			.then(res => res.json())
			.then(data => {
				alert("Created")
				setIsCreateModalVisible(false);
				getSubjectList();
			})
			.catch(err => console.log(err));
	};

	const onCreateFailed = (error) => {
		console.log(error);
	};

	const getSubjectList = () => {
		fetch('/api/subjects/?skip=0&limit=100', {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
				method: 'GET'
			},
		})
			.then(res => res.json())
			.then(data => {
				setSubjectList(data);
			})
			.catch(err => console.log(err));
	}

	useEffect(() => {
		getSubjectList();
	}, [])

	return (
		<>
			<Button type="primary" htmlType="button" onClick={showCreateModal}>
				Create Subject
			</Button>

			<Table columns={columns} dataSource={subjectList} />

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
				<p>Are you sure want to delete {selectedSubject.id} ?</p>
			</Modal>
		</>
	)
}
