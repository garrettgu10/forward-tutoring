import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import UserLink from './UserLink.jsx';
import ActionClear from 'material-ui/svg-icons/content/clear';

import {Link} from 'react-router-dom';

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

  handleCommentSubmit(event){
    event.preventDefault();
    Meteor.call('posts.comment', this.props.post._id, this.state.commentInputValue,
      function commentSubmitCallback(err) {
        if(err){
          alert(err);
        }
      });
    this.setState({
      commentInputValue: ""
    })
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
    var canComment = (this.props.currentUser._id === post.owner || this.props.currentUser.role !== 0);
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
        </CardActions>

        {this.state.displayComments &&
          <CardText style={{paddingTop: "10px", paddingBottom: "0px"}}>
            {post.comments.length !== 0 ? <Divider /> : <div>No comments yet.</div>}

            {post.comments.map(function(comment){
              return (
                <div key={comment._id}>
                  <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>

                    <div style={{flexGrow: "1", margin: "10px 0"}}>
                      <Link to={"/profile/"+comment.username}>{comment.username}</Link> &nbsp;&nbsp;
                      {comment.content}
                    </div>

                    <IconButton
                      onTouchTap={this.deleteComment.bind(this, comment._id)}>
                      <ActionClear />
                    </IconButton>

                  </div>
                  <Divider />
                </div>
              );
            }.bind(this))}

            {canComment &&
              <form style={{display: 'flex', alignItems: 'center'}} onSubmit={this.handleCommentSubmit.bind(this)}>
                <TextField
                  id="comment-input"
                  floatingLabelText="Comment"
                  rows={2}
                  value={this.state.commentInputValue}
                  onChange={this.handleCommentInputChange.bind(this)}
                  style={{flexGrow: '1'}} />
                <RaisedButton label="Submit" primary={true} type="submit" />
              </form>
            }

          </CardText>
        }
      </Card>
    )
  }
}
