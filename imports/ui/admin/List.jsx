import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Checkbox from 'material-ui/Checkbox';
import UserLink from '../UserLink.jsx';
import TextField from 'material-ui/TextField';

class UserItem extends Component {
  //TODO: Make it so admins can update assigned times/dates from panel
  handleConsistentCheck = () => {
    var {user} = this.props;
    var {_id} = user;
    var {consistent} = user;
    Meteor.call('users.setConsistent', _id, !consistent);
  }

  render() {
    var {user} = this.props;
    var {username} = user;
    var consistent = user.consistent;

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
class List extends Component {
    render()
    {
      if(!this.props.ready) {
        return <div className="container">loading</div>
      }

      if(this.props.users.length === 0) {
        return <div className="container">No tutors currently</div>
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
  var query = {};
  var search = Session.get("Admin.query");
  query.username = {$regex : '(' + search + '\\S+|' + search + ')'};
  //console.log(query.username);
  query.role = 1;
  var subscription = Meteor.subscribe('users.all', query);
  var users = Meteor.users.find(query).fetch();
  return {
    ready: subscription.ready(),
    query: query,
    users: users
  };
}, List)
