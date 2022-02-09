import {Table} from "antd";

export const UserLeavePage = () => {

	// [
	// 	{
	// 		"date": "2022-02-06",
	// 		"description": "string",
	// 		"approved": true,
	// 		"id": 0,
	// 		"user": {
	// 			"email": "user@example.com",
	// 			"is_active": true,
	// 			"is_superuser": false,
	// 			"full_name": "string",
	// 			"address": "string",
	// 			"gender": "string",
	// 			"id": 0,
	// 			"subjects": [],
	// 			"rosters": []
	// 		}
	// 	}
	// ]

	const dataSource = [
		{
			key: '1',
			id: '',
			date: 'Mike',
			description: 32,
			approved: '10 Downing Street',
		},
		{
			key: '2',
			name: 'John',
			age: 42,
			address: '10 Downing Street',
		},
	];

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
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
	];

	return (
		<>
			<Table dataSource={dataSource} columns={columns} />
		</>
	);
}
