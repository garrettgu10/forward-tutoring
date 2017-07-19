import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactRouter from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Sidebar from './Sidebar.jsx';
import Forum from './Forum.jsx';
import LoginForm from './LoginForm.jsx';
import RegistrationForm from './RegistrationForm.jsx';
import FlatButton from 'material-ui/FlatButton';
import { createContainer } from 'meteor/react-meteor-data';
import Home from './Home.jsx'

const NavLink = ReactRouter.NavLink;
const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Switch = ReactRouter.Switch;

//STUB COMPONENTS FOR TESTING ROUTES, WILL BE IN THEIR OWN FILES
//--------------------------------------------------------

var NotFound = function(props){
  return(
    <div>
      Not found. I probably haven't written this yet.
    </div>
  )
}

var Consistent = function(props){
  return (
    <div>
      DIS IS WARE PPL GOTS CONSISTNAT TUTERS<br />
      I HAZ NOT BUILT THIS PART YET
    </div>
  )
}

var logo = function(props) {
  return <span><span style={{fontWeight: 100}}>forward</span><span style={{fontWeight: 800}}>tutoring</span></span>
}

var RightButtons = function(props) {
  const buttonStyle= {
    color: 'white',
    marginTop: "4.5px",
    marginLeft: "2px"
  }
  if(props.currentUser == null){
    return(
      <div>
        <NavLink to="/register">
          <FlatButton style={buttonStyle} label="Sign up" />
        </NavLink>
        <NavLink to="/login">
          <FlatButton style={buttonStyle} label="Log in" />
        </NavLink>
      </div>
    )
  }else{
    return (
      <div>
        <NavLink to={"profile/" + props.currentUser.username}>
          <FlatButton style={buttonStyle} label={props.currentUser.username} />
        </NavLink>
        <FlatButton style={buttonStyle} label="Logout" onClick={Logout}/>
      </div>
    )
  }
}

var Logout = function() {
  Meteor.logout(function(err){
    if(err) alert(err);
  });
}
//--------------------------------------------------------


class App extends Component {
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
              iconElementRight={<RightButtons currentUser={this.props.currentUser}/>}
            />

            <div className="main-container">
              <Sidebar ref={(item) => {this.sidebar = item;}}/>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/forum" component={
                  (props) => {
                    return <Forum currentUser={this.props.currentUser} />;
                  }
                } />
                <Route path="/consistent" component={Consistent} />
                <Route path="/register" component={RegistrationForm} />
                <Route path="/login" component={LoginForm} />
                <Route path="/" component={NotFound} />
              </Switch>
              <Route path="/logout" component={Logout} />
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  }
}, App);
