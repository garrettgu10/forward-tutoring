import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Accounts} from 'meteor/accounts-base';
import {Redirect} from 'react-router-dom';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
      roleInputValue: 0, //0 -- student, 1 -- tutor, 2 -- admin
      roleKeyInputValue: "",
      success: false
    }
  }

  handleInputChange(field, event){
    this.setState({
      [field + "InputValue"]: event.target.value
    });
  }

  handleRoleInputChange(event, value){
    this.setState({
      roleInputValue: value
    })
  }

  handleSubmit(e){
    if(e) e.preventDefault();
    //TODO: Add checks for stuff

    Accounts.createUser({
      username: this.state.usernameInputValue,
      email: this.state.emailInputValue,
      password: this.state.passwordInputValue,
      profile: {
        fullName: this.state.firstnameInputValue + " " + this.state.lastnameInputValue
      },
      role: this.state.roleInputValue,
      roleKey: this.state.roleKeyInputValue
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
      <form className="container" onSubmit={this.handleSubmit.bind(this)}>
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
        <SelectField name="role"
          value={this.state.roleInputValue}
          onChange={this.handleRoleInputChange.bind(this)}
          floatingLabelText="I am a">
          <MenuItem
            value={0}
            primaryText="Student" />
          <MenuItem
            value={1}
            primaryText="Tutor" />
          <MenuItem
            value={2}
            primaryText="Admin" />
        </SelectField>
        <TextField
          floatingLabelText="Registration Key"
          fullWidth={true}
          value={this.state.roleKeyInputValue}
          onChange={this.handleInputChange.bind(this, 'roleKey')} />
        <br />
        <br />
        <RaisedButton label="Submit" primary={true} type="submit" />

      </form>
    )
  }
}
