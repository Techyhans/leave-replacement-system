import {Outlet, useNavigate} from "react-router-dom";
import {Layout, Menu, Breadcrumb} from 'antd';
import {
	DesktopOutlined,
	PieChartOutlined,
	FileOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {useState} from "react";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

export const UserLayout = () => {

	const [collapsed, setCollapsed] = useState(false);
	const navigate = useNavigate()

	return (
		<Layout style={{minHeight: '100vh'}}>
			<Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
				<div className="logo">
					<img src={"https://upload.wikimedia.org/wikipedia/commons/8/8d/Google_logo_%282010-2013%29.svg"} width={180} alt="logo"/>
				</div>
				<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
					<Menu.Item key="1" icon={<PieChartOutlined/>}>
						Option 1
					</Menu.Item>
					<Menu.Item key="2" icon={<DesktopOutlined/>}>
						Option 2
					</Menu.Item>
					<SubMenu key="sub1" icon={<UserOutlined/>} title="Users">
						<Menu.Item key="3" onClick={() => navigate("/admin/users")}>View</Menu.Item>
					</SubMenu>
					<SubMenu key="sub2" icon={<TeamOutlined/>} title="Subjects">
						<Menu.Item key="6" onClick={() => navigate("/admin/subjects")}>View</Menu.Item>
					</SubMenu>
					<Menu.Item key="9" icon={<FileOutlined/>}>
						Files
					</Menu.Item>
				</Menu>
			</Sider>
			<Layout className="site-layout">
				<Header className="site-layout-background" style={{padding: 0}}/>
				<Content style={{margin: '0 16px'}}>
					<Breadcrumb style={{margin: '16px 0'}}>
						<Breadcrumb.Item>User</Breadcrumb.Item>
						<Breadcrumb.Item>Bill</Breadcrumb.Item>
					</Breadcrumb>
					<Outlet />
				</Content>
				<Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
			</Layout>
		</Layout>
	)
}
