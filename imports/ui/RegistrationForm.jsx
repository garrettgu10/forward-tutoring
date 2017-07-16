import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Accounts} from 'meteor/accounts-base';
import { Redirect } from 'react-router-dom';

export default class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state={
      usernameInputValue: "",
      firstnameInputValue: "",
      lastnameInputValue: "",
      emailInputValue: "",
      passwordInputValue: "",
      passwordConfirmInputValue: "",
      success: false
    }
  }

  handleInputChange(field, event){
    this.setState({
      [field + "InputValue"]: event.target.value
    });
  }

  handleSubmit(){
    //TODO: Add checks for stuff

    Accounts.createUser({
      username: this.state.usernameInputValue,
      email: this.state.emailInputValue,
      password: this.state.passwordInputValue,
      profile: {
        fullName: this.state.firstnameInputValue + " " + this.state.lastnameInputValue
      }
    }, function createUserCallback(err) {
      if(err){
        alert(err);
      }else{
        this.setState({ success: true });
      }
    }.bind(this))
  }

  render() {
    const from = this.props.from || '/';

    if(this.state.success){
      return <Redirect to={from} />
    }

    return (
      <div>
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
        <br />
        <br />
        <RaisedButton label="Submit" primary={true} onClick={this.handleSubmit.bind(this)} />

      </div>
    )
  }
}
