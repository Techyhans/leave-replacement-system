import {Table, Tag, Space, Form, Input, Button} from 'antd';
import React, {useEffect, useState} from "react";
import Modal from "antd/es/modal/Modal";
import { Select } from 'antd';
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import {find_nearest_date_from_day, generate_recurrent_date} from "../../../shared";

const { Option } = Select

export const UserPage = () => {

	const localizer = momentLocalizer(moment);

	const [userList, setUserList] = useState([]);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});
	const [subjectList, setSubjectList] = useState([]);
	const [isRosterModalVisible, setIsRosterModalVisible] = useState(false);

	const [events, setEvents] = useState([]);

	async function viewRosterModule(values) {
		let eventList = []
		for (let i = 0; i < values.rosters.length; i++) {
			console.log(values.rosters[i])
			let start_date = find_nearest_date_from_day(values.rosters[i].day, values.rosters[i].start_hour)
			let end_date = find_nearest_date_from_day(values.rosters[i].day, values.rosters[i].end_hour)
			let dt = await generate_recurrent_date(start_date, end_date, values.rosters[i].subject.name)
			eventList = eventList.concat(dt)
		}
		console.log("OUT", eventList)
		setEvents(eventList)
	}

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
					<Tag color={is_active ? 'green' : 'red'}>
						{is_active ? "Active" : "Inactive"}
					</Tag>
				</>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (rowData) => (
				<Space size="middle">
					{/*<a>Subjects Assigned</a>*/}
					<a onClick={
						() => {
							setSelectedUser(rowData);
							setIsEditModalVisible(true)
						}
					}>Edit</a>
					<a onClick={
						() => {
							setIsRosterModalVisible(true)
							viewRosterModule(rowData)
						}
					}>View Roster</a>
				</Space>
			),
		},
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

	const handleRosterOk = () => {
		setIsRosterModalVisible(false);
	}

	const handleRosterCancel = () => {
		setIsRosterModalVisible(false);
	}

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
		const dataToSubmit = {
			...values,
			subjects: subjectList.filter(subjectDetails => {
				if (values.subject_ids.includes(subjectDetails.code)) {
					return subjectDetails
				}
			})
		}

		fetch('/api/users/' + selectedUser.id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			body: JSON.stringify(dataToSubmit)

		})
			.then(res => res.json())
			.then(data => {
				alert("Updated")
				setIsEditModalVisible(false);
				getUserList();
			})
			.catch(err => console.log(err));
	};

	const onEditFailed = (error) => {
		console.log(error);
	};

	const onCreateFinish = (values) => {
		// const dataToSubmit = {
		// 	...values,
		// 	subjects: subjectList.filter(subjectDetails => {
		// 		if (values.subject_ids.includes(subjectDetails.code)) {
		// 			return parseInt(subjectDetails.code)
		// 		}
		// 	})
		// }

		fetch('/api/users/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			body: JSON.stringify(values)

		})
			.then(res => res.json())
			.then(data => {
				alert("Created")
				setIsCreateModalVisible(false);
				getUserList();
			})
			.catch(err => console.log(err));
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

	const handleChange = (value) => {
		console.log(`selected ${value}`);
	}

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
		getUserList();
		getSubjectList()
	}, [])

	return (
		<>
			<Button type="primary" htmlType="button" onClick={showCreateModal}>
				Create User
			</Button>

			<Table columns={columns} dataSource={userList}/>

			<Modal title="Create" visible={isCreateModalVisible} onOk={handleCreateOk} onCancel={handleCreateCancel}>
				<Form
					name="basic"
					labelCol={{span: 6}}
					wrapperCol={{span: 18}}
					onFinish={onCreateFinish}
					onFinishFailed={onCreateFailed}
					autoComplete="off"
				>
					<Form.Item
						label="Full Name"
						name="full_name"
						rules={[{required: true, message: 'Please input full name!'}]}
					>
						<Input/>
					</Form.Item>

					<Form.Item
						label="Address"
						name="address"
						rules={[{required: true, message: 'Please input address!'}]}
					>
						<Input/>
					</Form.Item>

					<Form.Item
						label="Email"
						name="email"
						rules={[{required: true, message: 'Please input email!'}]}
					>
						<Input/>
					</Form.Item>

					<Form.Item
						label="Gender"
						name="gender"
						rules={[{required: true, message: 'Please input gender!'}]}
					>
						<Input/>
					</Form.Item>

					<Form.Item
						label="Is Active"
						name="is_active"
						rules={[{required: true, message: 'Please input status!'}]}
					>
						<Select
							mode="single"
							allowClear
							style={{ width: '100%' }}
							placeholder="Please select"
							onChange={() => {}}
						>
							<Option value={true}>Yes</Option>
							<Option value={false}>No</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Is Superuser"
						name="is_superuser"
						rules={[{required: true, message: 'Please input role!'}]}
					>
						<Select
							mode="single"
							allowClear
							style={{ width: '100%' }}
							placeholder="Please select"
							onChange={() => {}}
						>
							<Option value={true}>Yes</Option>
							<Option value={false}>No</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[{required: true, message: 'Please input password!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Subject List"
						name="subjects"
						rules={[{required: true, message: 'Please select at least 1 subject!'}]}
					>
						<Select
							mode="multiple"
							allowClear
							style={{ width: '100%' }}
							placeholder="Please select"
							onChange={handleChange}
						>
							{
								subjectList && (
									subjectList.map((subjectDetails) => (
										<Option value={parseInt(subjectDetails.id)}>{ subjectDetails.name }</Option>
									))
								)
							}
						</Select>
					</Form.Item>

					<Form.Item wrapperCol={{offset: 6, span: 18}}>
						<Button type="primary" htmlType="submit">
							Create
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			<Modal title="Edit" visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
				<Form
					name="basic"
					labelCol={{span: 6}}
					wrapperCol={{span: 18}}
					onFinish={onEditFinish}
					onFinishFailed={onEditFailed}
					autoComplete="off"
				>
					<Form.Item
						label="Full Name"
						name="full_name"
						rules={[{required: true, message: 'Please input full name!'}]}
					>
						<Input/>
					</Form.Item>

					<Form.Item
						label="Address"
						name="address"
						rules={[{required: true, message: 'Please input address!'}]}
					>
						<Input/>
					</Form.Item>

					<Form.Item
						label="Email"
						name="email"
						rules={[{required: true, message: 'Please input email!'}]}
					>
						<Input/>
					</Form.Item>

					<Form.Item
						label="Gender"
						name="gender"
						rules={[{required: true, message: 'Please input gender!'}]}
					>
						<Input/>
					</Form.Item>

					<Form.Item
						label="Is Active"
						name="is_active"
						rules={[{required: true, message: 'Please input status!'}]}
					>
						<Select
							mode="single"
							allowClear
							style={{ width: '100%' }}
							placeholder="Please select"
							onChange={() => {}}
						>
							<Option value={true}>Yes</Option>
							<Option value={false}>No</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Is Superuser"
						name="is_superuser"
						rules={[{required: true, message: 'Please input role!'}]}
					>
						<Select
							mode="single"
							allowClear
							style={{ width: '100%' }}
							placeholder="Please select"
							onChange={() => {}}
						>
							<Option value={true}>Yes</Option>
							<Option value={false}>No</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[{required: true, message: 'Please input password!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Subject List"
						name="subject_ids"
						rules={[{required: true, message: 'Please select at least 1 subject!'}]}
					>
						<Select
							mode="multiple"
							allowClear
							style={{ width: '100%' }}
							placeholder="Please select"
							defaultValue={selectedUser.subjects && selectedUser.subjects.map((subjectDetails) => { return subjectDetails.code })}
							onChange={handleChange}
						>
							{
								subjectList && (
									subjectList.map((subjectDetails) => (
										<Option value={subjectDetails.code}>{ subjectDetails.name }</Option>
									))
								)
							}
						</Select>
					</Form.Item>

					<Form.Item wrapperCol={{offset: 6, span: 18}}>
						<Button type="primary" htmlType="submit">
							Edit
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			<Modal title="Delete" visible={isDeleteModalVisible} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
				<p>Are you sure want to delete {selectedUser.full_name}?</p>
			</Modal>

			<Modal title="View Roster" visible={isRosterModalVisible} onOk={handleRosterOk} onCancel={handleRosterCancel} width={2000}>
				<Calendar
					localizer={localizer}
					defaultDate={new Date()}
					defaultView="month"
					events={events}
					style={{ height: "100vh" }}
					// startAccessor={start => {
					//   var s = toNewDate(start.dates[0].days.startDate);
					//   return subDays(s, start.dates[0].numPreDays);
					// }}
					// endAccessor={end => {
					//   var e = toNewDate(end.dates[0].days.endDate);
					//   return addDays(e, end.dates[0].numPostDays);
					// }}
				/>
			</Modal>
		</>
	)
}
