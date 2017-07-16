import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Accounts} from 'meteor/accounts-base';
import { Redirect } from 'react-router-dom';

export default class LoginForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
      usernameInputValue: "",
      passwordInputValue: "",
      success: false
    };
  }

  handleInputChange(field, event) {
    this.setState({
      [field+"InputValue"]: event.target.value
    });
  }

  handleSubmit() {
    Meteor.loginWithPassword(this.state.usernameInputValue, this.state.passwordInputValue, (err) => {
      if(err){
        alert(err)
      }else{
        this.setState({
          success: true
        })
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.success && <div>success</div>}
        <TextField
          ref="username"
          floatingLabelText="Username"
          fullWidth={true}
          value={this.state.usernameInputValue}
          onChange={this.handleInputChange.bind(this, 'username')} />
        <TextField
          ref="password"
          floatingLabelText="Password"
          fullWidth={true}
          value={this.state.passwordInputValue}
          onChange={this.handleInputChange.bind(this, 'password')}
          type="password" />
        <br />
        <br />
        <RaisedButton label="Submit" primary={true} onClick={this.handleSubmit.bind(this)} />
      </div>
    )
  }
}
