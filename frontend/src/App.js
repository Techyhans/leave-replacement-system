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
							{/*<Route path="/chargers" element={<Chargers/>}/>*/}
							{/*<Route path="/event-log" element={<EventLog/>}/>*/}
						</Route>
						<Route path="/admin" element={<AdminLayout/>}>
							<Route path="/admin/users" element={<UserPage />}/>
							<Route path="/admin/subjects" element={<SubjectPage />}/>
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
