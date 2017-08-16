import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Schools} from '../api/schools.js';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ActionClear from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';

class SchoolForm extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      name: "",
      key: ""
    }
  }

  handleTextChange(field, event) {
    this.setState({
      [field]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    Meteor.call('schools.insert', this.state.name, this.state.key, (err) => {
      if(err) {
        alert(err);
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          value={this.state.name}
          onChange={this.handleTextChange.bind(this, 'name')}
          floatingLabelText="Name"
        />
        <TextField
          value={this.state.key}
          onChange={this.handleTextChange.bind(this, 'key')}
          floatingLabelText="Key"
        />
        <RaisedButton
          label="Submit"
          type="submit"
          primary={true}
        />
      </form>
    )
  }
}

class SchoolItem extends Component {
  handleDelete() {
    Meteor.call('schools.remove', this.props.school._id, (err) => {
      if(err) alert(err);
    })
  }

  render() {
    var {school} = this.props;
    return (
      <div key={school._id}>
        School name: {school.name} <br />
        School key: {school.key} <br />
        <IconButton
          onTouchTap={this.handleDelete.bind(this, school._id)}>
          <ActionClear />
        </IconButton>
      </div>
    )
  }
}

class SchoolsList extends Component {
  render() {
    var {ready, schools} = this.props;

    if(!ready) {
      return(
        <div style={{textAlign: "center"}}>
          <CircularProgress size={80} thickness={5} />
        </div>
      );
    }

    return (
      <div className="container">
        <SchoolForm />

        {schools.length === 0 &&
          <div>No schools (yet)</div>
        }

        {schools.map((school) => (
          <SchoolItem key={school._id} school={school} />
        ))}
      </div>
    )
  }
}

export default createContainer((props) => {
  var subscription = Meteor.subscribe('schools');
  
  return {
    ready: subscription.ready(),
    schools: Schools.find({}).fetch()
  }
}, SchoolsList);