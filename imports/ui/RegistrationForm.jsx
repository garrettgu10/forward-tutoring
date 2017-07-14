import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state={
      usernameInputValue: "",
      firstnameInputValue: "",
      lastnameInputValue: "",
      emailInputValue: "",
      passwordInputValue: "",
      passwordConfirmInputValue: ""
    }
  }

  handleInputChange(field, event){
    this.setState({
      [field + "InputValue"]: event.target.value
    });
  }

  handleSubmit(){
    console.log(this.state);
  }

  render() {
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
          onChange={this.handleInputChange.bind(this, 'password')} />
        <TextField
          ref="passwordConfirm"
          floatingLabelText="Password Confirm"
          fullWidth={true}
          value={this.state.passwordConfirmInputValue}
          onChange={this.handleInputChange.bind(this, 'passwordConfirm')} />
        <br />
        <br />
        <RaisedButton label="Submit" primary={true} onClick={this.handleSubmit.bind(this)} />

      </div>
    )
  }
}
