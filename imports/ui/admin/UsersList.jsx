import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Checkbox from 'material-ui/Checkbox';
import UserLink from '../UserLink.jsx';
import TextField from 'material-ui/TextField';

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

class UserList extends Component {
  constructor(props)
  {
    this.state = {
      text : '',
      results : [],
    }
  }

  handleChange(e)
  {
    var query = e.target.value
    this.state.text = query
    if(this.state.text.length >= 2)
    {
      findUsers();
    }
  }

  findUsers()
  {
      let result = this.props.users.find({username : this.state.text});
      this.state.results = result;
  }

  render() {
    if(!this.props.ready) {
      return <div className="container">loading</div>
    }

    if(this.props.users.length === 0) {
      return <div className="container">No tutors currently</div>
    }

    return (
      <div className="container">
        <TextField
          ref="name"
          floatingLabelText="Name"
          fullWidth={true}
          onChange = {this.handleChange.bind(this)}/>
        <div className="container">
          {this.state.results.map((user) => (
            <UserItem key={user._id} user={user} />
          ))}
        </div>
      </div>
    );
  }
}

export default createContainer((props) => {
  var subscription = Meteor.subscribe('users.all');
  var users = Meteor.users.find({role: 1}).fetch();
  return {ready: subscription.ready(), users};
}, UserList)
