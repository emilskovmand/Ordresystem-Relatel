import './sass/index.css';
import FrontPage from './components/newOrder/main'
import Godkendt from './components/GodtkendtTilProduktion/main'
import Afventer from './components/GodkendProduktion/main'
import Færdigeordre from './components/FærdigeOrdre/main'
import SideNavigation from './components/shared/navigation'
import PrivateRoute from './components/privateRoute'
import LoginComponent from './components/auth/login'
import React, { useEffect, useState } from 'react'
import { GetUser } from './services/userService'
import { ProvideAuth, useAuth } from './components/context/auth'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
	let auth = useAuth();

	useEffect(() => {

		return () => {
		}
	}, [auth])

	return (
		<ProvideAuth>
			<Router>
				<div id="App" className="wrapper">
					<Switch>
						<Route exact path='/login' >
							<LoginComponent />
						</Route>
						<PrivateRoute path='/afventer' >
							<SideNavigation />
							<Afventer />
						</PrivateRoute>
						<PrivateRoute path='/færdigeordre'>
							<SideNavigation />
							<Færdigeordre />
						</PrivateRoute>
						<PrivateRoute path='/godkendt'>
							<SideNavigation />
							<Godkendt />
						</PrivateRoute>
						<PrivateRoute exact={true} path='/'>
							<SideNavigation />
							<FrontPage />
						</PrivateRoute>
					</Switch>
				</div>
			</Router>
		</ProvideAuth>
	);
}

export default App;