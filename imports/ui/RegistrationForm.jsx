import React, {Component} from 'react';

import {createContainer} from 'meteor/react-meteor-data';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Accounts} from 'meteor/accounts-base';
import {Redirect} from 'react-router-dom';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

import {Roles} from '../constants/constants.js';

import {Schools} from '../api/schools.js';

//https://stackoverflow.com/questions/39356826/how-to-check-if-it-a-text-input-has-a-valid-email-format-in-reactjs
const emailRegex = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state={
      usernameInputValue: "",
      firstnameInputValue: "",
      lastnameInputValue: "",
      emailInputValue: "",
      passwordInputValue: "",
      passwordConfirmInputValue: "",
      schoolInputValue: 0,
      roleKeyInputValue: "",
      success: false
    }
  }

  handleInputChange(field, event){
    this.setState({
      [field + "InputValue"]: event.target.value
    });
  }

  handleSchoolInputChange(event, value){
    this.setState({
      schoolInputValue: value
    })
  }

  handleSubmit(e){
    if(e) e.preventDefault();

    var {usernameInputValue, 
      emailInputValue, 
      passwordInputValue,
      passwordConfirmInputValue, 
      firstnameInputValue, 
      lastnameInputValue, 
      roleKeyInputValue, 
      schoolInputValue} = this.state;

    if(!emailInputValue || !emailRegex.test(emailInputValue)){
      this.setState({
        emailError: "Please enter a valid email"
      });
      return;
    }
    
    if(passwordInputValue.length < 7){
      this.setState({
        passError: 'Please enter a password with at least 7 characters'
      });
      return;
    }

    if(passwordConfirmInputValue !== passwordInputValue) {
      this.setState({
        passConfirmError: "The two passwords don't match"
      });
      return;
    }

    var account = {
      username: usernameInputValue,
      email: emailInputValue,
      password: passwordInputValue,
      profile: {
        fullName: firstnameInputValue + " " + lastnameInputValue
      },
      role: this.props.role || 0,
      roleKey: roleKeyInputValue
    };

    if(account.role === 0) {
      account.schoolId = this.props.schools[schoolInputValue]._id;
      account.school = this.props.schools[schoolInputValue].name;
    }

    Accounts.createUser(account, function createUserCallback(err) {
      if(err){
        switch(err.error) {
          case 'bad-username': 
            this.setState({usernameError: err.reason});
            break;
          case 'bad-name':
            this.setState({nameError: err.reason});
            break;
          case 'bad-key':
            this.setState({keyError: err.reason});
            break;
          default:
            alert(err);
        }
      }else{
        this.setState({ success: true });
      }
    }.bind(this))
  }

  render() {
    const from = this.props.from || '/';

    if(!this.props.ready) {
      return (
        <div style={{textAlign: "center"}}>
          <CircularProgress size={80} thickness={5} />
        </div>
      );
    }

    const role = this.props.role || 0;

    if(role === 0 && this.props.schools.length === 0){
      return (
        <div className="container">
          Registration is not available yet. Please check back later!
        </div>
      )
    }

    if(this.state.success){
      return <Redirect to={from} />;
    }

    if(this.props.userId){
      return <Redirect to="/" />;
    }

    return (
      <div className="container">
        <h1 style={{fontSize: '40px', fontWeight: '200', marginBottom: '0'}}>Sign up</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <TextField
            ref="username"
            floatingLabelText="Username"
            fullWidth={true}
            value={this.state.usernameInputValue}
            onChange={this.handleInputChange.bind(this, 'username')}
            errorText={this.state.usernameError} />
          <TextField
            ref="firstname"
            floatingLabelText="First Name"
            fullWidth={true}
            value={this.state.firstnameInputValue}
            onChange={this.handleInputChange.bind(this, 'firstname')}
            errorText={this.state.nameError} />
          <TextField
            ref="lastname"
            floatingLabelText="Last Name"
            fullWidth={true}
            value={this.state.lastnameInputValue}
            onChange={this.handleInputChange.bind(this, 'lastname')}
            errorText={this.state.nameError} />
          <TextField
            ref="email"
            floatingLabelText="Email"
            fullWidth={true}
            value={this.state.emailInputValue}
            onChange={this.handleInputChange.bind(this, 'email')}
            errorText={this.state.emailError} />
          <TextField
            ref="password"
            floatingLabelText="Password"
            fullWidth={true}
            value={this.state.passwordInputValue}
            onChange={this.handleInputChange.bind(this, 'password')}
            type="password"
            errorText={this.state.passError} />
          <TextField
            ref="passwordConfirm"
            floatingLabelText="Password Confirm"
            fullWidth={true}
            value={this.state.passwordConfirmInputValue}
            onChange={this.handleInputChange.bind(this, 'passwordConfirm')}
            type="password"
            errorText={this.state.passConfirmError} />
          {role === 0 &&
            <SelectField name="school"
              value={this.state.schoolInputValue}
              onChange={this.handleSchoolInputChange.bind(this)}
              floatingLabelText="School">
              {this.props.schools.map((school, index) => (
                <MenuItem
                  key={school._id}
                  value={index}
                  primaryText={school.name} />
              ))}
            </SelectField>
          }
          <TextField
            floatingLabelText="Registration Key"
            fullWidth={true}
            value={this.state.roleKeyInputValue}
            onChange={this.handleInputChange.bind(this, 'roleKey')}
            errorText={this.state.keyError} />
          <br />
          {role !== 0 &&
            <div>Note: you are registering as a {Roles[role]}.</div>
          }
          <br />
          <RaisedButton label="Submit" primary={true} type="submit" />

        </form>
      </div>
    )
  }
}

export default createContainer((props) => {
  var subscription = Meteor.subscribe('schools');
  
  return {
    ready: subscription.ready(),
    schools: Schools.find({}).fetch(),
    userId: Meteor.userId()
  }
}, RegistrationForm);
