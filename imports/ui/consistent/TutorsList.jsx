import React, {Component} from 'react';
import {Users} from '../../api/users.js';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';

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
          <div key={tutor._id}>{JSON.stringify(tutor)}</div>
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
