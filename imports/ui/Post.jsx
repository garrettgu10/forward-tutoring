import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class Post extends Component {

  constructor(props){
    super(props);
    this.state = {
      commentInputValue: "",
      displayComments: false
    }
  }

  handleCommentInputChange(event) {
    this.setState({
      commentInputValue: event.target.value
    })
  }

  handleCommentSubmit(){
    Meteor.call('posts.comment', this.props.post._id, this.state.commentInputValue);
  }

  toggleDisplayComments() {
    this.setState({
      displayComments: !this.state.displayComments
    })
  }

  render() {
    var post = this.props.post;
    if(!post.comments) post.comments = [];
    return (
      <Card key={post._id} style={{marginTop: '25px'}}>
        <CardHeader
          title={post.title}
          subtitle={post.username}
        />
        <CardText>
          {post.content}
        </CardText>
        <CardActions>
          <FlatButton
            label={post.comments.length + " Comments"}
            onTouchTap ={this.toggleDisplayComments.bind(this)}/>
          {this.props.currentUser._id == post.owner &&
            <FlatButton label="Delete" onTouchTap={this.props.handleDelete} />}

          {this.state.displayComments && post.comments.map(function(comment){
            return <div key={comment._id}><b>{comment.username}</b>: {comment.content}</div>;
          })}

          <TextField
            id="comment-input"
            floatingLabelText="Comment"
            multiLine={true}
            rows={2}
            fullWidth={true}
            value={this.state.commentInputValue}
            onChange={this.handleCommentInputChange.bind(this)} />
          <br />
          <RaisedButton label="Submit" primary={true} onClick={this.handleCommentSubmit.bind(this)} />

        </CardActions>
      </Card>
    )
  }
}
