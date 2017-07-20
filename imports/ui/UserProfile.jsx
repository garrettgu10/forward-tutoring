/**
 * Created by garrettgu on 7/19/17.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Users} from '../api/users.js';

class UserProfile extends Component {

  render() {
    return (
      <div>
        {this.props.match.params.username}
        {JSON.stringify(this.props.user)}
      </div>
    );
  }
}

export default createContainer((props) => {
  const username = props.match.params.username;

  const subscription = Meteor.subscribe('user', username);

  return{
    user: Users.find({username: username}).fetch()[0]
  }
}, UserProfile);