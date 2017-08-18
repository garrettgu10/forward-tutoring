import React, {Component} from 'react';
import {Accounts} from 'meteor/accounts-base';

import TimedRedirect from '../TimedRedirect.jsx';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class ResetPass extends Component {
  constructor (props) {
    super(props);
    this.state = {
      success: false,
      password: "",
      verify: "",
      error: null
    }
  }

  handleInputChange = (field, event) => {
    this.setState({
      [field]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if(this.state.password !== this.state.verify) {
      this.setState({
        error: "Your passwords don't match."
      });
      return;
    }

    Accounts.resetPassword(this.props.match.params.token, this.state.password, (err) => {
      if(err) alert(err);
      else this.setState({success: true});
    })
  }

  render() {
    if(this.state.success) {
      return (
        <TimedRedirect redirectTo="/" text="You have successfully reset your password." />
      )
    }

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>

          <TextField
            type="password"
            value={this.state.password}
            onChange={this.handleInputChange.bind(this, "password")}
            fullWidth={true}
            floatingLabelText="New password" />

          <TextField
            type="password"
            value={this.state.verify}
            onChange={this.handleInputChange.bind(this, "verify")}
            fullWidth={true}
            floatingLabelText="Verify new password"
            errorText={this.state.error} />

          <br />
          <br />
          
          <RaisedButton type="submit" primary={true} label="Submit" />
        </form>
      </div>
    )
  }
}