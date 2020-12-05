import './sass/index.css';
import FrontPage from './components/newOrder/main'
import Godkendt from './components/UnderProduktion/main'
import Afventer from './components/GodkendProduktion/main'
import Færdigeordre from './components/FærdigeOrdre/main'
import Papirkurv from './components/papirkurv/main'
import SideNavigation from './components/shared/navigation'
import PrivateRoute from './components/privateRoute'
import LoginComponent from './components/auth/login'
import React, { useEffect } from 'react'
import { GetUser } from './services/userService'
import { ProvideAuth, useProvideAuth } from './components/context/auth'

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
						<PrivateRoute path='/papirkurv'>
							<SideNavigation />
							<Papirkurv />
						</PrivateRoute>
						<PrivateRoute path='/config'>
							<SideNavigation />
						</PrivateRoute>
					</Switch>
				</div>
			</Router>
		</ProvideAuth>
	);
}

export default App;