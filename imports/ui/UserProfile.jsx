/**
 * Created by garrettgu on 7/19/17.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Users} from '../api/users.js';
import CircularProgress from 'material-ui/CircularProgress';
import Roles from '../constants/roles.js';

class UserProfile extends Component {

  render() {
    if(!this.props.ready){
      return (
        <div style={{textAlign: "center"}}>
          <CircularProgress size={80} thickness={5} />
        </div>
      )
    }
    const user = this.props.user;

    if(!user) {
      return(
        <div>
          Error: User not found.
        </div>
      )
    }

    return (
      <div id={user._id}>
        <Card>
          <CardHeader
            title={user.username}
            subtitle={"Full name: " + user.profile.fullName}
            avatar={user.profile.image || "/default_icon.png"}
          />
          <CardText>
            Role: {Roles[user.role]}<br />
            Email: {user.emails[0].address}<br />
            Member since: {user.createdAt.toDateString()}
          </CardText>
        </Card>
      </div>

    )
  }
}

export default createContainer((props) => {
  const username = props.match.params.username;

  const subscription = Meteor.subscribe('user', username);

  return{
    user: Users.find({username: username}).fetch()[0],
    ready: subscription.ready()
  }
}, UserProfile);