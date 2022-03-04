import {Table, Tag, Space, Form, Input, Button, notification, Spin} from 'antd';
import React, {useEffect, useState} from "react";
import Modal from "antd/es/modal/Modal";
import { Select } from 'antd';
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import {find_nearest_date_from_day, generate_recurrent_date} from "../../../utils";
import { TimePicker } from 'antd';
import axios from "axios";
const { Option } = Select

export const UserPage = () => {

	const [loading, setLoading] = useState(false);
	const localizer = momentLocalizer(moment);
	const [selectedUserId, setSelectedUserId] = useState();
	const [userList, setUserList] = useState([]);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});
	const [selectedRosterDetails, setSelectedRosterDetails] = useState({});
	const [subjectList, setSubjectList] = useState([]);
	const [isRosterModalVisible, setIsRosterModalVisible] = useState(false);
	const [isAssignRosterVisible, setIsAssignRosterVisible] = useState(false);
	const [isDeleteRosterVisible, setIsDeleteRosterVisible] = useState(false);

	const [events, setEvents] = useState([]);
	const [form] = Form.useForm();

	async function viewRosterModule(values) {
		let eventList = []
		for (let i = 0; i < values.rosters.length; i++) {
			let start_date = find_nearest_date_from_day(values.rosters[i].day, values.rosters[i].start_hour)
			let end_date = find_nearest_date_from_day(values.rosters[i].day, values.rosters[i].end_hour)
			let dt = await generate_recurrent_date(start_date, end_date, values.rosters[i].subject.name)
			eventList = eventList.concat(dt)
		}
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
							form.setFieldsValue({
								full_name: rowData.full_name,
								address: rowData.address,
								email: rowData.email,
								gender: rowData.gender,
								is_active: rowData.is_active,
								is_superuser: rowData.is_superuser,
								subject_ids: rowData.subjects.map(subjectDetails => {
									return subjectDetails.id
								})
							})
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
					<a onClick={
						() => {
							setIsAssignRosterVisible(true)
							setSelectedUserId(rowData.id)
						}
					}>Assign Roster</a>
					<a onClick={
						() => {
							setSelectedRosterDetails(rowData.rosters.map(rosterDetails => {
								return {
									id: rosterDetails.id,
									day: rosterDetails.day,
									start_hour: rosterDetails.start_hour,
									end_hour: rosterDetails.end_hour,
									subject_name: rosterDetails.subject.name,
									subject_code: rosterDetails.subject.code,
								}
							}))
							setIsDeleteRosterVisible(true)
						}
					}>Delete Roster</a>
				</Space>
			),
		},
	];

	const handleDeleteRosterOk = () => {
		setIsDeleteRosterVisible(false);
	};


	const handleDeleteRosterCancel = () => {
		setIsDeleteRosterVisible(false);
	};

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

	const handleAssignRosterOk = () => {
		setIsAssignRosterVisible(false);
	}

	const handleAssignRosterCancel = () => {
		setIsAssignRosterVisible(false);
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

			})
			.catch(err => console.log(err))
			.finally(() => {
				setIsDeleteModalVisible(false);
				getUserList();
			})
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
				notification["success"]({
					message: 'Success',
					description:
						'User Updated Successfully',
				});
				setIsEditModalVisible(false);
				getUserList();
			})
			.catch(err => console.log(err));
	};

	const onEditFailed = (error) => {
		console.log(error);
	};

	const onCreateFinish = (values) => {
		setLoading(true)

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
				notification["success"]({
					message: 'Success',
					description:
						'User Created Successfully',
				});
				setIsCreateModalVisible(false);
				getUserList();
			})
			.catch(err => console.log(err))
			.finally(() => setLoading(false));
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

	function onDeleteRoster(record) {
		setLoading(true)
		axios.delete(`/api/rosters/${record.id}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			}
		})
			.then((res) => {
				// alert("Roster Deleted Successfully")
				// setIsDeleteRosterVisible(false)
				// getUserList()
			})
			.catch((error) => {
				console.log("error", error)
			})
			.finally(() => {
				notification["success"]({
					message: 'Success',
					description:
						'Roster Deleted Successfully',
				});
				setIsDeleteRosterVisible(false)
				getUserList()
				setLoading(false)
			})
	}

	const deleteRosterColumns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Day',
			dataIndex: 'day',
			key: 'day',
		},
		{
			title: 'Start Hour',
			dataIndex: 'start_hour',
			key: 'start_hour',
		},
		{
			title: 'End Hour',
			dataIndex: 'end_hour',
			key: 'end_hour',
		},
		{
			title: 'Subject Name',
			dataIndex: 'subject_name',
			key: 'subject_name',
		},
		{
			title: 'Subject Code',
			dataIndex: 'subject_code',
			key: 'subject_code',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<a onClick={() => onDeleteRoster(record)}>Delete</a>
				</Space>
			),
		},
	];

	const assignRosterColumns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: text => <a>{text}</a>,
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'Tags',
			key: 'tags',
			dataIndex: 'tags',
			render: tags => (
				<>
					{tags.map(tag => {
						let color = tag.length > 5 ? 'geekblue' : 'green';
						if (tag === 'loser') {
							color = 'volcano';
						}
						return (
							<Tag color={color} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						);
					})}
				</>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<a>Invite {record.name}</a>
					<a>Delete</a>
				</Space>
			),
		},
	];

	const assignRosterData = [
		{
			key: '1',
			name: 'John Brown',
			age: 32,
			address: 'New York No. 1 Lake Park',
			tags: ['nice', 'developer'],
		},
		{
			key: '2',
			name: 'Jim Green',
			age: 42,
			address: 'London No. 1 Lake Park',
			tags: ['loser'],
		},
		{
			key: '3',
			name: 'Joe Black',
			age: 32,
			address: 'Sidney No. 1 Lake Park',
			tags: ['cool', 'teacher'],
		},
	];

	const onAssignRosterFinish = (values) => {
		setLoading(true)
		values.start_hour = new Date(values.start_hour).getHours()
		values.end_hour = new Date(values.end_hour).getHours()
		values.user_id = selectedUserId
		axios.post("/api/rosters/", values, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			}
		})
			.then(result => {
				setIsAssignRosterVisible(false)
				getUserList()
				notification["success"]({
					message: 'Success',
					description:
						'Roster Assigned Successfully',
				});
			})
			.catch(error => {
				console.log(error)
			})
			.finally(() => setLoading(false))
	};

	const onAssignRosterFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	const format = 'HH';

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

			<Modal title="Create User" visible={isCreateModalVisible} onOk={handleCreateOk} onCancel={handleCreateCancel} footer={null}>
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
						rules={[{
								required: true, message: 'Please input email!'
							},{
								type: "email"
							}
							]}
					>
						<Input/>
					</Form.Item>

					<Form.Item
						label="Gender"
						name="gender"
						rules={[{required: true, message: 'Please input gender!'}]}
					>
						<Select
							mode="single"
							allowClear
							style={{ width: '100%' }}
							placeholder="Please select"
							onChange={() => {}}
						>
							<Option value={"male"}>Male</Option>
							<Option value={"female"}>Female</Option>
						</Select>
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

					{
						loading ? <Spin /> : (
							<Form.Item wrapperCol={{offset: 6, span: 18}}>
								<Button type="primary" htmlType="submit">
									Create
								</Button>
							</Form.Item>
						)
					}
				</Form>
			</Modal>

			<Modal title="Edit User" visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel} footer={null}>
				<Form
					form={form}
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
						<Select
							mode="single"
							allowClear
							style={{ width: '100%' }}
							placeholder="Please select"
							onChange={() => {}}
						>
							<Option value={"male"}>Male</Option>
							<Option value={"female"}>Female</Option>
						</Select>
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
							// defaultValue={selectedUser.subjects && selectedUser.subjects.map((subjectDetails) => { return subjectDetails.code })}
							onChange={handleChange}
						>
							{
								subjectList && (
									subjectList.map((subjectDetails) => (
										<Option value={subjectDetails.id}>{ subjectDetails.name }</Option>
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

			<Modal title="Assign Roster" visible={isAssignRosterVisible} onOk={handleAssignRosterOk} onCancel={handleAssignRosterCancel} footer={null}>
				<Form
					name="basic"
					labelCol={{
						span: 6,
					}}
					wrapperCol={{
						span: 18,
					}}
					initialValues={{
						remember: true,
					}}
					onFinish={onAssignRosterFinish}
					onFinishFailed={onAssignRosterFinishFailed}
					autoComplete="off"
				>
					<Form.Item
						label="Day"
						name="day"
					>
						<Select defaultValue="monday" style={{ width: 120 }} onChange={() => {}}>
							<Option value="monday">monday</Option>
							<Option value="tuesday">tuesday</Option>
							<Option value="wednesday">wednesday</Option>
							<Option value="thursday">thursday</Option>
							<Option value="friday">friday</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Start Time (hour)"
						name="start_hour"
					>
						<TimePicker format={format} />
					</Form.Item>

					<Form.Item
						label="End Time (hour)"
						name="end_hour"
					>
						<TimePicker format={format} />
					</Form.Item>

					<Form.Item
						label="Subject Name"
						name="subject_id"
					>
						<Select
							style={{ width: '100%' }}
							placeholder="Please select"
							defaultValue={subjectList.length > 0 && parseInt(subjectList[0].id)}
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

					{
						loading ? <Spin /> : (
							<Form.Item
								wrapperCol={{
									offset: 8,
									span: 16,
								}}
							>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						)
					}
				</Form>
			</Modal>

			<Modal title="Delete Roster" visible={isDeleteRosterVisible} onOk={handleDeleteRosterOk} onCancel={handleDeleteRosterCancel} width={1500}>
				<Table dataSource={selectedRosterDetails} columns={deleteRosterColumns} />
			</Modal>
		</>
	)
}
