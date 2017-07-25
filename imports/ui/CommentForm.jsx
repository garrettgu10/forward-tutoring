import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

export default class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: ""
    }
  }

  handleInputChange(event) {
    this.setState({
      inputValue: event.target.value
    })
  }

  handleSubmit(event){
    event.preventDefault();
    Meteor.call('posts.comment', this.props.postId, this.state.inputValue,
      function commentSubmitCallback(err) {
        if(err){
          alert(err);
        }
      });
    this.setState({
      inputValue: ""
    })
  }

  render() {
    return(
      <form style={{display: 'flex', alignItems: 'center'}} onSubmit={this.handleSubmit.bind(this)}>
        <TextField
          id="comment-input"
          floatingLabelText="Comment"
          rows={2}
          value={this.state.inputValue}
          onChange={this.handleInputChange.bind(this)}
          style={{flexGrow: '1'}} />
        <RaisedButton label="Submit" primary={true} type="submit" />
      </form>
    )
  }
}
