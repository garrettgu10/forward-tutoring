import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactRouter from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Sidebar from './Sidebar.jsx';
import Forum from './Forum.jsx';
import LoginForm from './LoginForm.jsx';
import RegistrationForm from './RegistrationForm.jsx';
import FlatButton from 'material-ui/FlatButton';

const NavLink = ReactRouter.NavLink;
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

var logo = function(props) {
  return <span><span style={{fontWeight: 100}}>forward</span><span style={{fontWeight: 800}}>tutoring</span></span>
}

var RightButtons = function(props) {
  const buttonStyle= {
    color: 'white'
  }
  return(
    <div>
      <NavLink to="/login">
        <FlatButton style={buttonStyle} label="Login" />
      </NavLink>
      <NavLink to="/register">
        <FlatButton style={buttonStyle} label="Register" />
      </NavLink>
    </div>
  )
}
//--------------------------------------------------------


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  toggleSidebar() {
    this.sidebar.handleToggle();
  }

  render() {
    return(
      <MuiThemeProvider>
        <Router>
          <div>
            <AppBar
              title={logo()}
              onLeftIconButtonTouchTap = {this.toggleSidebar.bind(this)}
              iconElementRight={<RightButtons />}
            />

            <div className="main-container">
              <Sidebar ref={(item) => {this.sidebar = item;}}/>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/forum" component={Forum} />
                <Route path="/consistent" component={Consistent} />
                <Route path="/register" component={RegistrationForm} />
                <Route path="/login" component={LoginForm} />
              </Switch>
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}
