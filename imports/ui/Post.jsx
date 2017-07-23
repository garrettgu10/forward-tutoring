import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import UserLink from './UserLink.jsx';

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
    Meteor.call('posts.comment', this.props.post._id, this.state.commentInputValue,
      function commentSubmitCallback(err) {
        if(err){
          alert(err);
        }
      });
  }

  toggleDisplayComments() {
    this.setState({
      displayComments: !this.state.displayComments
    })
  }

  deleteComment(commentId){
    const postId = this.props.post._id;
    Meteor.call('posts.deleteComment', postId, commentId,
      function deleteCommentCallback(err){
        if(err){
          alert(err);
        }
      });
  }

  handleDelete(){
    Meteor.call('posts.remove', this.props.post._id,
      function deletePostCallback(err){
        if(err){
          alert(err);
        }
      });
  }

  render() {
    var post = this.props.post;
    if(!post.comments) post.comments = [];
    return (
      <Card key={post._id} style={{marginTop: '25px'}}>
        <CardTitle
          title={post.title}
          style={{paddingBottom: "5px"}}
        />
        <UserLink style={{marginLeft: "20px"}} username={post.username} />

        <CardText>
          {post.content}
        </CardText>
        <CardActions>
          <FlatButton
            label={post.numComments + " Comments"}
            onTouchTap ={this.toggleDisplayComments.bind(this)}/>
          {this.props.currentUser._id == post.owner &&
            <FlatButton label="Delete" onTouchTap={this.handleDelete.bind(this)} />}

          {this.state.displayComments &&
            post.comments.map(function(comment){
              return (
                <div key={comment._id}>
                  <div style={{margin: '10px 0', overflow: "auto"}}>
                    <IconButton
                      iconClassName="material-icons"
                      onTouchTap={this.deleteComment.bind(this, comment._id)}
                      style={{float: "right"}}>
                      clear
                    </IconButton>
                    <span>
                      <b>{comment.username}</b>: {comment.content}
                    </span>

                  </div>
                  <Divider />
                </div>
              );
            }.bind(this))
          }

          {this.state.displayComments &&
            <div>
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
            </div>
          }

        </CardActions>
      </Card>
    )
  }
}
