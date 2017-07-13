import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class PostForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      postInputValue: "",
      postTitleInputValue: ""
    }
  }

  handleSubmit() {
    Meteor.call('posts.insert', this.state.postTitleInputValue, this.state.postInputValue);
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

  render() {
    return (
      <div>
        <TextField
          id="post-title-input"
          floatingLabelText="Title"
          value={this.state.postTitleInputValue}
          fullWidth={true}
          onChange={this.handlePostTitleInputChange.bind(this)} />
        <br />
        <TextField
          id="post-input"
          floatingLabelText="Post content"
          multiLine={true}
          rows={2}
          fullWidth={true}
          value={this.state.postInputValue}
          onChange={this.handlePostInputChange.bind(this)} />
        <br />
        <RaisedButton label="Submit" primary={true} onClick={this.handleSubmit.bind(this)} />
      </div>
    );
  }
}
