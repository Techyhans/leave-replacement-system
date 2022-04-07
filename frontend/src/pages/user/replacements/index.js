import {useEffect, useState} from "react";
import axios from "axios";
import {Table} from "antd";

export const UserReplacementPage = () => {

    const [dataSource, setDataSource] = useState([]);
    const columns = [
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
            title: 'Subject Code',
            dataIndex: 'subject_code',
            key: 'subject_code',
        },
        {
            title: 'Subject Name',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: 'Class',
            dataIndex: 'cls',
            key: 'cls',
        },
    ];

    useEffect(() => {
        axios.put("/api/replacements/me", {},{
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setDataSource(res.data.map((data, index) => {
                return {
                    key: index,
                    day: data.roster.day,
                    start_hour: data.roster.start_hour,
                    end_hour: data.roster.end_hour,
                    subject_code: data.roster.subject.code,
                    subject_name: data.roster.subject.name,
                    cls: data.roster.cls
                }
            }));
        })
            .catch((error) => {
                console.log(error);

            })
    }, []);

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    );
};
