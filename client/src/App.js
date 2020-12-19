import './sass/index.css';
import FrontPage from './components/newOrder/main'
import Godkendt from './components/UnderProduktion/main'
import Afventer from './components/GodkendProduktion/main'
import Færdigeordre from './components/FærdigeOrdre/main'
import Papirkurv from './components/papirkurv/main'
import Config from './components/configure/configUsers'
import SideNavigation from './components/shared/navigation'
import PrivateRoute from './components/privateRoute'
import LoginComponent from './components/auth/login'
import React, { useEffect } from 'react'
import { GetUser } from './services/userService'
import { ProvideAuth, useProvideAuth } from './components/context/auth'
import { APIMessageProvider as ProvideAPI, APIMessageNotification } from './components/context/MessageReceiver'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
	let auth = useProvideAuth();

	useEffect(() => {
		GetUser().then(result => {
			if (result.user !== undefined) {
				if (auth.user === null) {
					auth.signout(() => {
						fetch('/api/user/logout');
					});
				}
				if (auth.user) {
					if (result.user.username !== auth.user.user.username || result.user._id !== auth.user.user._id) {
						auth.signout(() => {
							fetch('/api/user/logout');
						});
					}
				}
			}
			else if (auth.user) {
				auth.signout(() => {
					fetch('/api/user/logout');
				});
				window.location.reload();
			}
			else {
				auth.signout(() => {
					fetch('/api/user/logout');
				});
			}

		})

		return () => {
		}
	}, [auth])

	return (
		<ProvideAuth>
			<ProvideAPI>
				<Router>
					<div id="App" className="wrapper">
						<Switch>
							<Route exact path='/login' >
								<LoginComponent />
							</Route>
							<PrivateRoute path='/afventer' permission="approve">
								<SideNavigation />
								<Afventer />
							</PrivateRoute>
							<PrivateRoute path='/færdigeordre' permission="complete">
								<SideNavigation />
								<Færdigeordre />
							</PrivateRoute>
							<PrivateRoute path='/godkendt' permission="produce">
								<SideNavigation />
								<Godkendt />
							</PrivateRoute>
							<PrivateRoute exact={true} path='/'>
								<SideNavigation />
								<FrontPage />
							</PrivateRoute>
							<PrivateRoute path='/papirkurv' permission="complete">
								<SideNavigation />
								<Papirkurv />
							</PrivateRoute>
							<PrivateRoute path='/config'>
								<SideNavigation />
								<Config />
							</PrivateRoute>
						</Switch>
					</div>
				</Router>
				<APIMessageNotification />
			</ProvideAPI>
		</ProvideAuth>
	);
}

export default App;