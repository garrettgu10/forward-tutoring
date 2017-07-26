import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Card, {CardText, CardTitle} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Subjects} from '../constants/constants.js';

String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
}

export default class PostForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      postInputValue: "",
      postTitleInputValue: "",
      subjectValue: Subjects[0]
    }
  }

  handleSubmit() {
    Meteor.call('posts.insert', this.state.postTitleInputValue, this.state.postInputValue, this.state.subjectValue,
      function submitCallback(err) {
        if(err) alert(err);
      });
    this.setState({
      postInputValue: "",
      postTitleInputValue: ""
    })
  }

  handlePostInputChange(event) {
    this.setState({
      postInputValue: event.target.value
    })
  }

  handlePostTitleInputChange(event) {
    this.setState({
      postTitleInputValue: event.target.value
    })
  }

  handleSubjectChange(event, index, value){
    this.setState({
      subjectValue: value
    })
  }

  render() {
    return (
      <Card>
        <CardTitle
          title="New question"
          style={{paddingBottom: '0'}}
          />
        <CardText style={{paddingTop: '0'}}>
          <TextField
            id="post-title-input"
            floatingLabelText="Question"
            value={this.state.postTitleInputValue}
            fullWidth={true}
            onChange={this.handlePostTitleInputChange.bind(this)} />
          <br />
          <TextField
            id="post-input"
            floatingLabelText="Elaboration"
            multiLine={true}
            rows={2}
            fullWidth={true}
            value={this.state.postInputValue}
            onChange={this.handlePostInputChange.bind(this)} />
          <br />
          <SelectField
            floatingLabelText="Subject"
            value={this.state.subjectValue}
            onChange={this.handleSubjectChange.bind(this)}>
            {
              Subjects.map((subjectName) => {
                return(
                  <MenuItem
                    value={subjectName}
                    primaryText={subjectName.capitalize()}
                    key={subjectName} />
                )
              })
            }
          </SelectField>
          <br />
          <br />
          <RaisedButton label="Submit" primary={true} onClick={this.handleSubmit.bind(this)} />
        </CardText>
      </Card>
    );
  }
}
