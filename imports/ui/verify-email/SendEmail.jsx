import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import TimedRedirect from '../TimedRedirect.jsx';

export default class SendEmail extends Component {

  componentDidMount() {
    var {currentUser} = this.props;
    
    if(!currentUser) {
      return;
    }

    var email = currentUser.emails[0];
    
    if(email.verified) {
      return;
    }

    Meteor.call('users.sendEmail', (err) => {
      if(err) alert(err);
    });
  }

  render() {
    var {currentUser} = this.props;
    
    if(!currentUser) {
      return <div className="container">You are not logged in.</div>
    }

    var email = currentUser.emails[0];
    
    if(email.verified) {
      return <TimedRedirect text="Your email is already verified!" />
    }

    return (
      <div className="container">
        A verification email has been sent to {email.address}.
      </div>
    )
  }
}