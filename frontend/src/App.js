import React, {useEffect, useState} from 'react';
import {
	BrowserRouter,
	Route,
	Routes, Navigate
} from "react-router-dom";
import './App.css';
import {UserLayout} from "./layouts/userLayout";
import {Login} from "./pages/login";
import {AdminLayout} from "./layouts/adminLayout";
import {UserPage} from "./pages/admin/user";
import {SubjectPage} from "./pages/admin/subjects";
import {UserDashboardPage} from "./pages/user/dashboard";
import {UserLeavePage} from "./pages/user/leaves";
import {LeavePage} from "./pages/admin/leaves";

function App() {
	return (
		<>
			<BrowserRouter>
				{
					<Routes>
						<Route
							path="/"
							element={<Navigate to="/login"/>}
						/>
						<Route path="/user" element={<UserLayout/>}>
							<Route path="/user/dashboard" element={<UserDashboardPage />}/>
							<Route path="/user/leaves" element={<UserLeavePage />}/>
						</Route>
						<Route path="/admin" element={<AdminLayout/>}>
							<Route path="/admin/users" element={<UserPage />}/>
							<Route path="/admin/subjects" element={<SubjectPage />}/>
							<Route path="/admin/leaves" element={<LeavePage />}/>
						</Route>
						<Route
							element={<Login/>}
							path="/login"
						/>
						<Route
							path="*"
							element={
								<main style={{padding: "1rem"}}>
									<p>There's nothing here!</p>
								</main>
							}
						/>
					</Routes>
				}
			</BrowserRouter>
		</>
	);
}

export default App;
