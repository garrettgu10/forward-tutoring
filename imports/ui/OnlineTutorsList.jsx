import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '../api/users.js';
import UserLink from './UserLink.jsx';

class OnlineTutorsList extends Component {
  render() {
    if(!this.props.ready) return null;

    if(this.props.tutors.length === 0) {
      return <div style={{margin: "20px"}}>No tutors online currently.</div>
    }

    return (
      <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
        <div style={{padding: '0 20px'}}>Online tutors:</div>
        {this.props.tutors.map((tutor) => {
          return(
            <UserLink style={{margin: '10px 10px'}} key={tutor._id} username={tutor.username} />
          )
        })}
      </div>
    )
  }
}

export default createContainer((props) => {
  var subscription = Meteor.subscribe('users.onlineTutors');
  return {
    ready: subscription.ready(),
    tutors: Users.find({'status.online': true, role: 1}).fetch()
  }
}, OnlineTutorsList);