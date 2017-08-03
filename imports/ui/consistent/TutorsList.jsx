import React, {Component} from 'react';
import {Users} from '../../api/users.js';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import {Days} from '../../constants/constants.js';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
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

Array.prototype.shuffle = function() { //shuffles array
  for(var i = this.length-1; i > 0; i--){
    var j = Math.round(i * Math.random());
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
}

String.prototype.colorCode = function() {
  var hash = md5(this);

  return (hash).slice(-6);
};

class TutorView extends Component {
  constructor(props) {
    super(props);
    this.state={
      chosenTime: 0
    }
  }

  handleExpand() {
    this.props.handleFocus();
  }

  getChosenTime() {
    return this.state.chosenTime;
  }

  handleChosenTimeChanged(event, value) {
    this.setState({
      chosenTime: value
    })
  }

  render() {
    var {tutor, times} = this.props;
    return (
      <Card
        expanded={this.props.expanded}>
        <CardHeader
          title={tutor.profile.fullName}
          subtitle={"Username: " + tutor.username}
          avatar={
            <Avatar backgroundColor={'#'+tutor.username.colorCode()}>
              {tutor.username.charAt(0).toUpperCase()}
            </Avatar>
          }
          onTouchTap={this.handleExpand.bind(this)}
          style={{cursor: 'pointer'}}
          showExpandableButton={true}>
        </CardHeader>
        <CardText
          style={{paddingTop: '0'}}
          expandable={true}>
          <div>{tutor.tutorProfile.description}</div>
          <RadioButtonGroup
            name="times"
            valueSelected={this.state.chosenTime}
            onChange={this.handleChosenTimeChanged.bind(this)}>
            {times.intersect_sorted(tutor.tutorProfile.times).map((time) => {
              var day = Math.floor(time/5);
              var hour = time%5 + 5 + this.props.dateOffset;
              return (
                <RadioButton
                  key={time}
                  label={Days[day]+" "+hour+"-"+(hour+1+"PM")}
                  value={time} />
              )
            })}
          </RadioButtonGroup>
        </CardText>
      </Card>
    );
  }
}

class TutorsList extends Component {
  constructor(props) {
    super(props);
    this.tutorViews = [];
    this.state = {
      focusedTutor: 0
    }
  }

  handleChangeFocusedTutor(tutorIndex) {
    this.setState({
      focusedTutor: tutorIndex
    })
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
        {this.props.tutors.map((tutor, index) => (
          <TutorView
            ref={(ref) => {this.tutorViews[index] = ref;}}
            dateOffset={this.props.dateOffset}
            key={tutor._id}
            tutor={tutor}
            times={this.props.times}
            expanded={index === this.state.focusedTutor}
            handleFocus={this.handleChangeFocusedTutor.bind(this, index)} />
        ))}
      </div>
    )
  }
}

export default createContainer((props) => {
  var subscription = Meteor.subscribe('user.tutorsByTimes', props.times);
  return {
    tutors: Users.find({role: 1, "tutorProfile.times": {$in: props.times}}, {reactive: false}).fetch().shuffle(), //shuffle tutors to give an equal opportunity
    ready: subscription.ready()
  }
}, TutorsList);
