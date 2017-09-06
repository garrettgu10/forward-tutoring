import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Checkbox from 'material-ui/CheckBox';
import UserLink from '../UserLink.jsx';

class UserItem extends Component {
  handleConsistentCheck = () => {
    var {user} = this.props;
    var {_id} = user;
    var {consistent} = user;
    Meteor.call('users.setConsistent', _id, !consistent);
  }

  render() {
    var {user} = this.props;
    var {username} = user;
    var consistent = user.consistent
    
    return (
      <div style={{margin: '15px 0'}}>
        <UserLink username={username} />
        <Checkbox
          label="Consistent"
          checked={consistent}
          onCheck={this.handleConsistentCheck} />
      </div>
    );
  }
}

class UserList extends Component {
  render() {
    if(!this.props.ready) {
      return <div>loading</div>
    }
    return (
      <div className="container">
        {this.props.users.map((user) => (
          <UserItem key={user._id} user={user} />
        ))}
      </div>
    );
  }
}

export default createContainer((props) => {
  var subscription = Meteor.subscribe('users.all');
  var users = Meteor.users.find({role: 1}).fetch();
  return {ready: subscription.ready(), users};
}, UserList)