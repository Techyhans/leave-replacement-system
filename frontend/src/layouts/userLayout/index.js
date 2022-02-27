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
					<img src={require("../../assets/logo.jpeg")} style={{ width: "10vw" }} alt={"logo"}/>
				</div>
				<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
					<SubMenu key="sub1" icon={<TeamOutlined/>} title="User">
						<Menu.Item key="1" onClick={() => navigate("/user/dashboard")}>Dashboard</Menu.Item>
					</SubMenu>
					<SubMenu key="sub2" icon={<TeamOutlined/>} title="Leaves">
						<Menu.Item key="2" onClick={() => navigate("/user/leaves")}>View</Menu.Item>
					</SubMenu>
					<SubMenu key="sub3" icon={<TeamOutlined/>} title="Replacements">
						<Menu.Item key="3" onClick={() => navigate("/user/replacements")}>View</Menu.Item>
					</SubMenu>
					<Menu.Item key="99" onClick={() => navigate("/login")}>Log Out</Menu.Item>
				</Menu>
			</Sider>
			<Layout className="site-layout">
				<Header className="site-layout-background" style={{padding: 0}}/>
				<Content style={{margin: '0 16px'}}>
					<Breadcrumb style={{margin: '16px 0'}}>
						{/*<Breadcrumb.Item>User</Breadcrumb.Item>*/}
						{/*<Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
					</Breadcrumb>
					<Outlet />
				</Content>
				<Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
			</Layout>
		</Layout>
	)
}
