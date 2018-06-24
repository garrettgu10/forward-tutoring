import React, {Component} from 'react';
import ReactRouter from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
const NavLink = ReactRouter.NavLink;
const Link = ReactRouter.Link;
const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Redirect = ReactRouter.Redirect;
const Switch = ReactRouter.Switch;

import Sidebar from './Sidebar.jsx';
import Forum from './Forum.jsx';
import LoginForm from './LoginForm.jsx';
import RegistrationForm from './RegistrationForm.jsx';
import Home from './Home.jsx';
import UserProfile from './UserProfile.jsx';
import TutorSearch from './consistent/TutorSearch.jsx';
import EditTutorProfile from './consistent-tutor/EditTutorProfile.jsx';
import SendEmail from './verify-email/SendEmail.jsx';
import VerifyEmail from './verify-email/VerifyEmail.jsx';
import SchoolsList from './admin/SchoolsList.jsx';
import ForgotForm from './forgot/ForgotForm.jsx';
import ResetPass from './forgot/ResetPass.jsx';
import UsersList from './admin/UsersList.jsx';
import Terms from './Terms.jsx';
import TimedRedirect from './TimedRedirect.jsx';
import HourFourm from './HourFourm.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import {blue500, blue700, teal500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CircularProgress from 'material-ui/CircularProgress';
import AppBar from 'material-ui/AppBar';

import queryString from 'query-string';

var NotFound = function(props){
  return(
    <div className="container">
      <TimedRedirect text={
        <div>
          <h1>Oops.</h1>
          You shouldn't be here. <br />
          Don't worry, it's probably not your fault. <br />
          We'd appreciate it if you got in touch with us at <a href="mailto:forwardtutoringexecs@gmail.com">forwardtutoringexecs@gmail.com</a>.
        </div>
      } redirectTo="/" />
    </div>
  )
}

var logo = function(props) {
  return (
    <Link className="logo" to="/">
      <span>
        <span style={{fontWeight: 600}}>forward</span>
        <span style={{fontWeight: 300}}>tutoring</span>
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
        <div className="mobile-hide">
          <NavLink to="/register">
            <FlatButton style={buttonStyle} label="Sign up" />
          </NavLink>
          <NavLink to="/login">
            <FlatButton style={buttonStyle} label="Log in" />
          </NavLink>
        </div>
      </div>
    )
  }else{
    const {username} = props.currentUser;
    return (
      <div className="mobile-hide">
        <NavLink to={"/profile?" + queryString.stringify({username})}>
          <FlatButton style={buttonStyle} label={username} />
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
              style={{position: "fixed", width: "100%", backgroundColor: muiTheme.palette.primary2Color}}
              onLeftIconButtonClick = {this.toggleSidebar.bind(this)}
              iconElementRight={<RightButtons currentUser={this.props.currentUser}/>}
            />

            <div className="main-container" style={{paddingTop: '50px'}}>
              <Sidebar ref={(item) => {this.sidebar = item;}} currentUser={this.props.currentUser}/>
              <Switch>
                {!this.props.ready &&
                  <Route path="/(forum|consistent|verify)/" component={Loading} />
                }

                <Route exact path="/" component={() => <Home currentUser={this.props.currentUser} />} />
                <Route path="/forum" component={
                  () => <Forum currentUser={this.props.currentUser} />
                } />
                <Route path="/consistent" component={this.ConsistentPanel} />
                <Route path="/logtutorhours" component={HourFourm}/>
                <Route path="/verify" component={
                  () => <SendEmail currentUser={this.props.currentUser} />
                } />
                <Route path="/forgot" component={ForgotForm} />
                <Route path="/register/:role" component={RegistrationForm} />
                <Route path="/register" component={RegistrationForm} />
                <Route path="/login" component={LoginForm} />
                <Route path="/profile" component={UserProfile} />
                <Route path="/verify-email/:token" component={VerifyEmail} />
                <Route path="/forgot-password/:token" component={ResetPass} />
                <Route path="/admin/schools" component={SchoolsList} />
                <Route path="/admin/users" component={UsersList} />
                <Route path="/terms" component={Terms} />
                <Route path="/" component={NotFound} />
              </Switch>
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
    currentUser: Meteor.users.findOne(Meteor.userId()),
    ready: subscription.ready()
  }
}, App);
