import {Button, DatePicker, Form, Input, notification, Select, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import Modal from "antd/es/modal/Modal";
import {momentLocalizer} from "react-big-calendar";
import moment from "moment";
import axios from "axios";

export const LeavePage = () => {

	const [dataSource, setDataSource] = useState([]);
	const [isAssignLecturerModalVisible, setIsAssignLecturerModalVisible] = useState(false);
	const [lecturerToReplaceList, setLecturerToReplaceList] = useState([]);
	const [selectedRosterId, setSelectedRosterId] = useState();
	const [leaveDate, setLeaveDate] = useState();
	const [leaveId, setLeaveId] = useState();

	const handleAssignLecturerModalOk = () => {
		setIsAssignLecturerModalVisible(false);
	};

	const handleAssignLecturerModalCancel = () => {
		setIsAssignLecturerModalVisible(false);
	};

	const predictAssignLecturer = (roster_id) => {
		axios.post("/api/models/predict", {
			roster_id: roster_id
		}, {
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("token")
			}
		}).then(res => {
			const response = res.data
			setLecturerToReplaceList(response.map(lecturerDetails => {
				return {
					user_id: lecturerDetails.user.id,
					full_name: lecturerDetails.user.full_name,
					email: lecturerDetails.user.email,
					gender: lecturerDetails.user.gender,
					score: parseFloat(lecturerDetails.score).toFixed(2)
				}
			}));
			setIsAssignLecturerModalVisible(true)
		})
			.catch(err => {
				console.log(err)
			})
	}

	const getRosterBasedOnUser = (userId, day, leaveId) => {
		axios.get('/api/rosters/?skip=0&limit=100', {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
			.then((res) => {
				let rosterNeeded = []
				let found = false
				const response = res.data
				for (let i = 0; i < response.length; i++) {
					if (response[i].user_id == userId && response[i].day == day) {
						rosterNeeded.push(response[i])
						setSelectedRosterId(response[i].id)
						predictAssignLecturer(response[i].id)
						found = true
						break;
					}
				}
				if (!found) {
					updateLeaveToApprove(leaveId)
					getLeaveList()
				}
			})
			.catch((error) => {
				console.log(error)
			})
	};


	const updateLeaveToApprove = (leaveId) => {
		axios.put(`/api/leaves/${leaveId}`, {
			"approved": true
		},{
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
			.then((res) => {
				getLeaveList()
			})
			.catch((error) => {
				console.log(error)
			})
	}


	const getLeaveList = () => {
		fetch('/api/leaves/', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			}

		})
			.then(res => res.json())
			.then(data => {
				setDataSource(data.map((data) => {
					return {
						leave_id: data.id,
						description: data.description,
						date: data.date,
						approved: data.approved,
						full_name: data.user.full_name,
						user_id: data.user.id
					}
				}))
			})
			.catch(err => console.log(err));
	};

	const approveLeave = async (userId, leaveId, leaveDate) => {
		let day = ""
		if (moment(leaveDate).isoWeekday() == 1) {
			day = "monday"
		}
		if (moment(leaveDate).isoWeekday() == 2) {
			day = "tuesday"
		}
		if (moment(leaveDate).isoWeekday() == 3) {
			day = "wednesday"
		}
		if (moment(leaveDate).isoWeekday() == 4) {
			day = "thursday"
		}
		if (moment(leaveDate).isoWeekday() == 5) {
			day = "friday"
		}
		if (moment(leaveDate).isoWeekday() == 6) {
			day = "saturday"
		}
		if (moment(leaveDate).isoWeekday() == 7) {
			day = "sunday"
		}
		getRosterBasedOnUser(userId, day, leaveId)
	}

	const assignUserToLeave = (user_id) => {
		axios.post(`/api/replacements/`, {
			roster_id: selectedRosterId,
			user_id: user_id,
			date: leaveDate
		}, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			}
		})
			.then(res => {
				notification["success"]({
					message: 'Success',
					description:
						'Assigned Successfully',
				});
				updateLeaveToApprove(leaveId)
				getLeaveList();
				setIsAssignLecturerModalVisible(false)
			})
			.catch(err => console.log(err));
	}

	useEffect(() => {
		getLeaveList()
	}, [])

	const columns = [
		{
			title: 'Leave Id',
			dataIndex: 'leave_id',
			key: 'leave_id',
		},
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: 'Full Name',
			dataIndex: 'full_name',
			key: 'full_name',
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
					{record.approved ? 'Yes' : (
						<Space size="middle">
							<a onClick={
								() => {
									setLeaveDate(record.date)
									setLeaveId(record.leave_id)
									approveLeave(record.user_id, record.leave_id, record.date)
								}
							}>Approve</a>
						</Space>
					)}
				</span>
			),
		},
	];

	const assignLecturerColumns = [
		{
			title: 'Id',
			dataIndex: 'user_id',
			key: 'user_id',
		},
		{
			title: 'Full Name',
			dataIndex: 'full_name',
			key: 'full_name',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Gender',
			dataIndex: 'gender',
			key: 'gender',
		},
		{
			title: 'Score',
			dataIndex: 'score',
			key: 'score',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<a onClick={() => assignUserToLeave(record.user_id)}>Assign</a>
				</Space>
			),
		},
	];

	return (
		<>
			<Table dataSource={dataSource} columns={columns} />

			<Modal title="Assign Lecturer" visible={isAssignLecturerModalVisible} onOk={handleAssignLecturerModalOk} onCancel={handleAssignLecturerModalCancel} width={1500}>
				<Table dataSource={lecturerToReplaceList} columns={assignLecturerColumns} />
			</Modal>
		</>
	);
}
