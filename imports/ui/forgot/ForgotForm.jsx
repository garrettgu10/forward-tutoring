import React, {Component} from 'react';
import {Accounts} from 'meteor/accounts-base';

import TimedRedirect from '../TimedRedirect.jsx';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class ForgotForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      success: false
    }
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    Accounts.forgotPassword({email: this.state.email}, (err) => {
      if(err) alert(err);
      else this.setState({success: true});
    })
  }

  render() {
    if(this.state.success) {
      return (
        <TimedRedirect 
          redirectTo="/" 
          text="A password reset email has been sent. Please follow the instructions in the email." />
      )
    }

    return (
      <div className="container">
        <h1 style={{fontSize: '40px', fontWeight: '200', marginBottom: '0'}}>Forgot Password</h1>
        <form onSubmit={this.handleSubmit}>
          <TextField
            value={this.state.email}
            onChange={this.handleEmailChange}
            fullWidth={true}
            floatingLabelText="Email address" />

          <br />
          <br />
          
          <RaisedButton type="submit" primary={true} label="Submit" />
        </form>
      </div>
    )
  }
} 