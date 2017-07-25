import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import UserLink from './UserLink.jsx';
import DateView from './DateView.jsx';
import CommentView from './CommentView.jsx';

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
        <div style={{display: 'flex', alignItems: 'center'}}>
          <CardTitle
            title={post.title}
            style={{paddingBottom: "5px", flexGrow: "1"}}
          />
          <div style={{fontStyle: 'italic', color: "#9E9E9E", marginRight: '20px'}}>
            {post.subject || 'other'}
          </div>
        </div>
        <UserLink style={{marginLeft: "15px"}} username={post.username} />
        <DateView date={post.date} style={{margin: '10px 16px'}}/>

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
                <CommentView
                  key={comment._id}
                  commentObj={comment}
                  postId={post._id}
                  currentUser={this.props.currentUser} />
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
