import './sass/index.css';
import FrontPage from './components/newOrder/main'
import Godkendt from './components/GodtkendtTilProduktion/main'
import Afventer from './components/GodkendProduktion/main'
import Færdigeordre from './components/FærdigeOrdre/main'
import SideNavigation from './components/shared/navigation'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
	return (
		<Router>
			<div id="App" className="wrapper">
				<SideNavigation />
				<Switch>
					<Route path='/' exact component={FrontPage} />
					<Route path='/godkendt' component={Godkendt} />
					<Route path='/afventer' component={Afventer} />
					<Route path='/færdigeordre' component={Færdigeordre} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
