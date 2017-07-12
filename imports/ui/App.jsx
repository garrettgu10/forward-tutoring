import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactRouter from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Sidebar from './Sidebar.jsx';
import Forum from './Forum.jsx';

const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Switch = ReactRouter.Switch;

//STUB COMPONENTS FOR TESTING ROUTES, WILL BE IN THEIR OWN FILES
//--------------------------------------------------------
var Home = function(props) {
  return <div>HAI WE IS AT HOME</div>;
}

var Consistent = function(props){
  return <div>DIS IS WARE PPL GOTS CONSISTNAT TUTERS</div>
}
//--------------------------------------------------------


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  toggleSidebar() {
    this.sidebar.toggle();
  }

  render() {
    return(
      <MuiThemeProvider>
        <Router>
          <div>
            <AppBar
              title="Forward Tutoring"
              onLeftIconButtonTouchTap = {this.toggleSidebar.bind(this)}
            />

            <div className="main-container">
              <Sidebar ref={(item) => {this.sidebar = item;}}/>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/forum" component={Forum} />
                <Route path="/consistent" component={Consistent} />
              </Switch>
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}
