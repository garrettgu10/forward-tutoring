import React, {Component} from 'react';
import {Users} from '../../api/users.js';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import {Days} from '../../constants/constants.js';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import md5 from 'md5';

function intersect_sorted(a, b) { //finds intersection of two sorted arrays
  var result = [];
  var indexA = 0, indexB = 0;
  while(indexA < a.length && indexB < b.length) {
    if(a[indexA] < b[indexB]){
      indexA++;
    }else if(a[indexA] > b[indexB]){
      indexB++;
    }else{
      result.push(a[indexA]);
      indexA++;
      indexB++;
    }
  }
  return result;
}

Array.prototype.intersect_sorted = function(b){ //finds intersection of two sorted arrays
  return intersect_sorted(this, b);
}

String.prototype.colorCode = function() {
  var hash = md5(this);

  return (hash).slice(-6);
};

class TutorView extends Component {
  render() {
    var {tutor, times} = this.props;
    return (
      <Card>
        <CardHeader
          title={tutor.profile.fullName}
          subtitle={"Username: " + tutor.username}
          avatar={
            <Avatar backgroundColor={'#'+tutor.username.colorCode()}>
              {tutor.username.charAt(0).toUpperCase()}
            </Avatar>
          }
          actAsExpander={true}
          showExpandableButton={true}>
        </CardHeader>
        <CardText
          expandable={true}
          style={{paddingTop: '0'}}>
          <div>{tutor.tutorProfile.description}</div>
          {times.intersect_sorted(tutor.tutorProfile.times).map((time) => {
            var day = Math.floor(time/5);
            var hour = time%5 + 5 + this.props.dateOffset;
            return (<div key={time}>{Days[day]} {hour}-{hour+1}PM</div>);
          })}
        </CardText>
      </Card>
    );
  }
}

class TutorsList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.ready){
      return (
        <div style={{textAlign: "center"}}>
          <CircularProgress size={80} thickness={5} />
        </div>
      )
    }

    return (
      <div>
        {this.props.tutors.map((tutor) => (
          <TutorView dateOffset={this.props.dateOffset} key={tutor._id} tutor={tutor} times={this.props.times} />
        ))}
      </div>
    )
  }
}

export default createContainer((props) => {
  var subscription = Meteor.subscribe('user.tutorsByTimes', props.times);
  return {
    tutors: Users.find({role: 1, "tutorProfile.times": {$in: props.times}}).fetch(),
    ready: subscription.ready()
  }
}, TutorsList);
