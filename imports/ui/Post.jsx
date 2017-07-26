import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionDone from 'material-ui/svg-icons/action/done';
import {grey500, grey900} from 'material-ui/styles/colors';

import Divider from 'material-ui/Divider';

import UserLink from './UserLink.jsx';
import DateView from './DateView.jsx';
import CommentView from './CommentView.jsx';
import CommentForm from './CommentForm.jsx';

import {Link} from 'react-router-dom';

String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
}

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

  handleToggleAnswered(){
    Meteor.call('posts.toggleAnswered', this.props.post._id,
      function toggleAnsweredCallback(err){
        if(err) alert(err);
      })
  }

  render() {
    var post = this.props.post;
    if(!post.comments) post.comments = [];
    const canComment = (this.props.currentUser._id === post.owner || this.props.currentUser.role !== 0);
    const canDelete = (this.props.currentUser._id === post.owner || this.props.currentUser.role === 2);
    const canMarkAnswered = (this.props.currentUser._id === post.owner ||  this.props.currentUser.role !== 0);
    return (
      <Card key={post._id} style={{marginTop: '25px'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <CardTitle
            title={
              <div style={{display: 'flex', alignItems: 'center'}}>
                {post.answered && <ActionDone style={{flexShrink: '0'}} />}
                <div>{post.title}</div>
              </div>}
            style={{paddingBottom: "5px", flexGrow: "1"}}
          />
          <div style={{fontStyle: 'italic', color: "#9E9E9E", marginRight: '20px'}}>
            {post.subject? post.subject.capitalize() : ''}
          </div>
        </div>
        <UserLink style={{marginLeft: "15px"}} username={post.username} />
        <DateView date={post.date} style={{margin: '10px 16px'}}/>

        <CardText>
          {post.content}
        </CardText>
        <CardActions style={{display: 'flex', alignItems: 'center'}}>
          <FlatButton
            label={post.numComments + " Comments"}
            onTouchTap ={this.toggleDisplayComments.bind(this)}/>
          <div style={{flexGrow: '1'}}></div>
          {canMarkAnswered &&
            <IconButton
              tooltip={"Mark "+(post.answered? "un": "")+"answered"}
              onTouchTap={this.handleToggleAnswered.bind(this)}>
              <ActionDone color={(post.answered? grey900: grey500)}/>
            </IconButton>
          }
          {canDelete &&
            <IconButton tooltip="Delete" onTouchTap={this.handleDelete.bind(this)}>
              <ActionDelete />
            </IconButton>}
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
              <CommentForm postId={post._id} />
            }

          </CardText>
        }
      </Card>
    )
  }
}
