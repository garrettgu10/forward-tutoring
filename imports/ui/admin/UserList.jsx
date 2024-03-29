import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Checkbox from 'material-ui/Checkbox';
import UserLink from '../UserLink';
import Shift from './Shift';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add'

class UserItem extends Component {
  //TODO: Make it so admins can update assigned times/dates from panel
  constructor(props)
  {
    super(props);
    var {user} = this.props;
  }
  handleConsistentCheck = () => {
    var {user} = this.props;
    var {_id} = user;
    var {consistent} = user;
    Meteor.call('users.setConsistent', _id, !consistent);
  }
  
  handleClick()
  {
    //console.log(this.props.user._id);
    Meteor.call('users.addShift', this.props.user._id);
  }
  render() {
    var {user} = this.props;
    var {username} = user;
    var consistent = user.consistent;
    var height = (user.shifts.length + 1) * 100 + 50;
    //console.log(this.state);
    //console.log(user.shifts);

    return (
      <div style={{margin: '15px 0', height}}>
        <UserLink username={username} />
        <Checkbox
          style = {{'float' : 'left', 'width' : '350px', 'marginTop' : '32px'}}
          label="Consistent"
          checked={consistent}
          onCheck={this.handleConsistentCheck} />
         <div style = {{marginTop : '75px'}}>
         {user.shifts !== undefined && user.shifts.length !== 0 && user.shifts.map((shift) => {
          return <Shift key = {shift.day * 10 + shift.hour} shift={shift} user={user}/>;
          })}
        <IconButton>
            <Add onClick = {this.handleClick.bind(this)}/>
        </IconButton>
         </div> 

      </div>

    );
  }
}
class UserList extends Component {
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
            <UserItem key={user._id} user={user}/>
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
}, UserList)
