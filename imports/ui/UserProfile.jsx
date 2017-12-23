import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Users} from '../api/users.js';
import CircularProgress from 'material-ui/CircularProgress';
import {Roles} from '../constants/constants.js';
import Avatar from 'material-ui/Avatar';
import {Days} from '../constants/constants.js';
import queryString from 'query-string';

import md5 from 'md5';

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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

function convert24to12(hour){
  var num = (hour+11)%12 + 1;
  var suffix = hour < 12? 'AM': 'PM';
  return num + " " + suffix;
}

function TimeDescriptions({times}) {
  var result = "";
  var shownDay = [];
  for(time of times) {
    var day = Math.floor(time/5);
    var time = time%5 + 5;
    if(!shownDay[day]) {
      result += Days[day].slice(0,3) + " ";
      shownDay[day] = true;
    }
    result += time + "-" + (time+1) + "PM, ";
  }

  result = result.slice(0, result.length-2); //cut off last comma
  result += " (Eastern time)"

  return <span>{result}</span>
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
        <div className="container">
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
            <b>Role:</b> {Roles[user.role].capitalize()}<br />
            <b>Email:</b> {user.emails[0].address}<br />
            <b>Member since:</b> {user.createdAt.toDateString()}<br />
            {user.skype && <div><b>Skype:</b> {user.skype}</div>}
            {user.school && <div><b>School:</b> {user.school}</div>}
            {user.tutorProfile &&
              <div>
                <b>Tutor info:</b>
                <div style={{paddingLeft: "20px"}}>
                  <b>Description:</b> {user.tutorProfile.description}<br />
                  {user.tutorProfile.times &&
                    <div>
                      <b>Available times:</b>&nbsp;
                      <TimeDescriptions times={user.tutorProfile.times} />
                    </div>
                  }
                </div>
              </div>
            }
            {user.instant && 
              <div>
                <b>Assigned forum time:</b> {DAYS[user.instant.day]} {convert24to12(user.instant.hour)}-{convert24to12((user.instant.hour+1)%24)} Central
              </div>
            }
            {
              this.props.time != null && 
              <div><b>Scheduled time:</b> {getTimeDescription(this.props.time)}</div>
            }
          </CardText>
        </Card>
      </div>

    )
  }
}

export default createContainer((props) => {
  let parsed = false;
  if(props.location){
    parsed = queryString.parse(props.location.search);
  }

  const username = parsed? parsed.username: props.username;
  const id = parsed? parsed.id: props.id;

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
