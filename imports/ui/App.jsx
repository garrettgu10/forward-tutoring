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
import TutorSearch from './consistent/TutorSearch.jsx';
import EditTutorProfile from './consistent-tutor/EditTutorProfile.jsx';
import {blue500, blue700, teal500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const NavLink = ReactRouter.NavLink;
const Link = ReactRouter.Link;
const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Redirect = ReactRouter.Redirect;
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

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue500,
    primary2Color: blue700,
    accent1Color: teal500,
  },
  appBar: {
    height: 50,
  },
});


class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  toggleSidebar() {
    this.sidebar.handleToggle();
  }

  ConsistentPanel = (props) => {
    var {currentUser, ready} = this.props;
    if(!ready) return <Loading />
    if(!currentUser) return <Redirect to="/login" />;

    switch(currentUser.role){
      case 0: return <TutorSearch currentUser={currentUser} />;
      case 1: return <EditTutorProfile currentUser={currentUser} />;
      default : return (<div className="container">You must be logged in as a student or a tutor to do this.</div>);
    }
  }

  render() {
    return(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router>
          <div>
            <AppBar
              title={logo()}
              style={{position: "fixed", width: "100%", backgroundColor: blue700}}
              onLeftIconButtonTouchTap = {this.toggleSidebar.bind(this)}
              iconElementRight={<RightButtons currentUser={this.props.currentUser}/>}
            />

            <div className="main-container" style={{paddingTop: '50px'}}>
              <Sidebar ref={(item) => {this.sidebar = item;}}/>
              <Switch>
                {!this.props.ready &&
                  <Route path="/(forum|consistent)/" component={Loading} />
                }

                <Route exact path="/" component={() => <Home loggedIn={this.props.currentUser !== null} />} />
                <Route path="/forum" component={
                  () => <Forum currentUser={this.props.currentUser} />
                } />
                <Route path="/consistent" component={this.ConsistentPanel} />
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
    if(!Meteor.userId()){
      return{
        currentUser: null,
        ready: true
      }
    }
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
