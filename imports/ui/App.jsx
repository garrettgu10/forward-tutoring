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
import Home from './Home.jsx';
import UserProfile from './UserProfile.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import TutorSearch from './TutorSearch.jsx';

const NavLink = ReactRouter.NavLink;
const Link = ReactRouter.Link;
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

var logo = function(props) {
  return (
    <Link className="logo" to="/">
      <span>
        <span style={{fontWeight: 800}}>forward</span>
        <span style={{fontWeight: 100}}>tutoring</span>
      </span>
    </Link>
  );
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
        <NavLink to={"/profile/" + props.currentUser.username}>
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

var Loading = function(){
  return(
    <div style={{textAlign: "center"}}>
      <CircularProgress size={80} thickness={5} />
    </div>
  )
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
              style={{position: "fixed", width: "100%"}}
              onLeftIconButtonTouchTap = {this.toggleSidebar.bind(this)}
              iconElementRight={<RightButtons currentUser={this.props.currentUser}/>}
            />

            <div className="main-container" style={{paddingTop: '80px'}}>
              <Sidebar ref={(item) => {this.sidebar = item;}}/>
              <Switch>
                {!this.props.ready &&
                  <Route path="/(forum|consistent)/" component={Loading} />
                }

                <Route exact path="/" component={() => <Home loggedIn={this.props.currentUser !== null} />} />
                <Route path="/forum" component={
                  () => <Forum currentUser={this.props.currentUser} />
                } />
                <Route path="/consistent" component={TutorSearch} />
                <Route path="/register" component={RegistrationForm} />
                <Route path="/login" component={LoginForm} />
                <Route path="/profile/:username" component={UserProfile} />
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
  if(!Meteor.loggingIn()){
    var subscription = Meteor.subscribe('user.byId', Meteor.userId());
  }else{
    return {
      currentUser: null,
      ready: false
    }
  }

  return {
    currentUser: Meteor.users.findOne(Meteor.userId(), {fields: {_id: 1, emails: 1, profile: 1, username: 1, createdAt: 1, role: 1}}),
    ready: subscription.ready()
  }
}, App);
