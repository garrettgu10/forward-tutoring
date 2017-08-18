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

    //TODO: Add checks for stuff

    var account = {
      username: this.state.usernameInputValue,
      email: this.state.emailInputValue,
      password: this.state.passwordInputValue,
      profile: {
        fullName: this.state.firstnameInputValue + " " + this.state.lastnameInputValue
      },
      role: this.props.role || 0,
      roleKey: this.state.roleKeyInputValue
    };


    if(account.role === 0) {
      account.schoolId = this.props.schools[this.state.schoolInputValue]._id;
      account.school = this.props.schools[this.state.schoolInputValue].name;
    }

    Accounts.createUser(account, function createUserCallback(err) {
      if(err){
        alert(err);
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
            onChange={this.handleInputChange.bind(this, 'username')} />
          <TextField
            ref="firstname"
            floatingLabelText="First Name"
            fullWidth={true}
            value={this.state.firstnameInputValue}
            onChange={this.handleInputChange.bind(this, 'firstname')} />
          <TextField
            ref="lastname"
            floatingLabelText="Last Name"
            fullWidth={true}
            value={this.state.lastnameInputValue}
            onChange={this.handleInputChange.bind(this, 'lastname')} />
          <TextField
            ref="email"
            floatingLabelText="Email"
            fullWidth={true}
            value={this.state.emailInputValue}
            onChange={this.handleInputChange.bind(this, 'email')} />
          <TextField
            ref="password"
            floatingLabelText="Password"
            fullWidth={true}
            value={this.state.passwordInputValue}
            onChange={this.handleInputChange.bind(this, 'password')}
            type="password" />
          <TextField
            ref="passwordConfirm"
            floatingLabelText="Password Confirm"
            fullWidth={true}
            value={this.state.passwordConfirmInputValue}
            onChange={this.handleInputChange.bind(this, 'passwordConfirm')}
            type="password" />
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
            onChange={this.handleInputChange.bind(this, 'roleKey')} />
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
