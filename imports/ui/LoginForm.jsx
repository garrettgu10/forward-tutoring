import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Accounts} from 'meteor/accounts-base';
import {Redirect, Link} from 'react-router-dom';

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

  handleSubmit(e) {
    if(e) e.preventDefault();

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
      <div className="container">
        <h1 style={{fontSize: '40px', fontWeight: '200', marginBottom: '0'}}>Login</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          {this.state.success &&
            <Redirect to="/" />
          }
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
          <div style={{marginTop: "15px"}}>
            <RaisedButton label="Submit" primary={true} type="submit" />
            <span style={{float: 'right', lineHeight: "36px"}}>
              <Link to="/register" className="link">
                Sign up
              </Link>
              <Link to="/forgot" className="link">
                Forgot password
              </Link>
            </span>
          </div>
        </form>
      </div>
    )
  }
}
