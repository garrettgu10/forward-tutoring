import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Schools} from '../api/schools.js';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

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
          <div key={school._id}>
            School name: {school.name} <br />
            School key: {school.key}
          </div>
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