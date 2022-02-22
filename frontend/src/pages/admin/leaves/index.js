import {Button, DatePicker, Form, Input, Select, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import Modal from "antd/es/modal/Modal";
import {momentLocalizer} from "react-big-calendar";
import moment from "moment";
import axios from "axios";

export const LeavePage = () => {

	const [dataSource, setDataSource] = useState([]);

	const getLeaveList = () => {
		fetch('/api/leaves/', {
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
	};

	const approveLeave = (leaveId) => {
		axios.put(`/api/leaves/${leaveId}`, {
			"approved": true
		}, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			}
		})
			.then(res => {
				getLeaveList();
			})
			.catch(err => console.log(err));
	}

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
					{record.approved ? 'Yes' : (
						<Space size="middle">
							<a onClick={
								() => {
									approveLeave(record.id)
								}
							}>Approve</a>
						</Space>
					)}
				</span>
			),
		},
	];

	return (
		<>
			<Table dataSource={dataSource} columns={columns} />
		</>
	);
}
