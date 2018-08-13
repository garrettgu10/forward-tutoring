import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import UserLink from '../UserLink';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {Days} from '../../constants/constants.js';

const Times = ["4:00 PM", "5:00 PM", "6:00 PM", '7:00 PM', '8:00 PM', '9:OO PM'];
const offset = 16;

class UserItem extends Component {
  //TODO: Make it so admins can update assigned times/dates from panel
  constructor(props)
  {
    super(props);
    var {user} = this.props;
    var {day, hour} = user.instant;
    //console.log(day + " " + hour);
    if(day === -1)
    {
      day = 'N/A';
    }
    else {
      day = Days[day];
    }

    if(hour === -1)
    {
      hour = 'N/A';
    }
    else {
      hour = Times[hour - offset];
    }

    this.state = {
      day,
      hour,
    };
  }
  handleConsistentCheck = () => {
    var {user} = this.props;
    var {_id} = user;
    var {consistent} = user;
    Meteor.call('users.setConsistent', _id, !consistent);
  }

  handleSubmit()
  {
    var {user} = this.props;
    var {_id} = user;
    var payload = {};
    payload.day = Days.indexOf(this.state.day);
    payload.hour = this.state.hour === "N/A" ? -1 : Times.indexOf(this.state.hour) + offset;
    console.log(payload);

    Meteor.call('users.setInstant', _id, payload);
  }

  handleDayChange(event, index, value)
  {
    this.setState({day : value});
  }

  handTimeChange(event, index, value)
  {
    this.setState({hour : value});
  }

  render() {
    var {user} = this.props;
    var {username} = user;
    var consistent = user.consistent;
    console.log(this.state);

    return (
      <div style={{margin: '15px 0'}}>
        <UserLink username={username} />
        <Checkbox
          style = {{'float' : 'left', 'width' : '350px', 'marginTop' : '32px'}}
          label="Consistent"
          checked={consistent}
          onCheck={this.handleConsistentCheck} />
        <SelectField
          style = {{'float': 'left', 'marginRight' : '10px'}}
          floatingLabelText="Weekly Tutoring Day"
          value = {this.state.day}
          onChange = {this.handleDayChange.bind(this)}
          >
          <MenuItem key = 'N/A' value = 'N/A' primaryText = 'N/A'/>
          {
            Days.map((day) => {
              return(
                <MenuItem key={day} value={day} primaryText={day} />
              );
            })
          }
        </SelectField>
        <SelectField
          style = {{'float': 'left'}}
          floatingLabelText="Weekly Tutoring Time"
          value = {this.state.hour}
          onChange = {this.handTimeChange.bind(this)}
          >
          <MenuItem key = 'N/A' value = 'N/A' primaryText = 'N/A'/>
          {
            Times.map((time) => {
              return(
                <MenuItem key={time} value={time} primaryText={time} />
              );
            })
          }
        </SelectField>
        <RaisedButton
          primary = {true}
          label = "Submit"
          style = {{"float" : 'left', 'margin' : '15px 0 0 15px'}}
          onClick = {this.handleSubmit.bind(this)}
         />
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
}, UserList)
