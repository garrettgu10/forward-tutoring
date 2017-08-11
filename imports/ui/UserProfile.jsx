/**
 * Created by garrettgu on 7/19/17.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Users} from '../api/users.js';
import CircularProgress from 'material-ui/CircularProgress';
import {Roles} from '../constants/constants.js';
import Avatar from 'material-ui/Avatar';
import {Days} from '../constants/constants.js';

import md5 from 'md5';

String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.colorCode = function() {
  var hash = md5(this);

  return (hash).slice(-6);
};

function getTimeDescription(timeNum) {
  var day = Math.floor(timeNum/5);
  var time = timeNum%5 + 5;
  return Days[day] + " " + time + " PM";
}

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
      <div id={user._id} className="container">
        <Card>
          <CardHeader
            title={user.username}
            subtitle={"Full name: " + user.profile.fullName}
            avatar={
              <Avatar backgroundColor={'#'+user.username.colorCode()}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            }
          />
          <CardText style={{paddingTop: 0}}>
            Role: {Roles[user.role].capitalize()}<br />
            Email: {user.emails[0].address}<br />
            Member since: {user.createdAt.toDateString()}<br />
            {user.tutorProfile &&
              <div>
                Tutor info:
                <div style={{paddingLeft: "20px"}}>
                  Skype: {user.skype}<br />
                  Description: {user.tutorProfile.description}<br />
                  {this.props.time != null? 
                    <div>Scheduled time: {getTimeDescription(this.props.time)}</div>
                    :
                    <div>
                      Available times: {user.tutorProfile.times.map(
                        (timeNum, index) => (
                          <span key={timeNum}>
                            {getTimeDescription(timeNum)
                              + (index === user.tutorProfile.times.length-1? "": ", ") /*insert comma if not last element */
                            }
                          </span>
                        ))}
                    </div>
                  }
                </div>
              </div>
            }
          </CardText>
        </Card>
      </div>

    )
  }
}

export default createContainer((props) => {
  const username = (props.match? props.match.params.username : props.username);
  const id = (props.match? props.match.params.id : props.id);

  var query;
  var subscription;

  if(!username && !id) {
    return{
      user: null,
      ready: true
    }
  }else if(username) {
    query = {username: username};
    subscription = Meteor.subscribe('user', username);
  }else {
    query = {_id: id};
    subscription = Meteor.subscribe('user.byId', id);
  }

  return{
    user: Users.find(query).fetch()[0],
    ready: subscription.ready(),
    time: props.time
  }
}, UserProfile);
