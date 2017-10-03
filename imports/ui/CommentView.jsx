import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import DateView from './DateView.jsx';
import ActionClear from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';

import queryString from 'query-string';

export default class CommentView extends Component {

  delete() {
    const postId = this.props.postId;
    const commentId = this.props.commentObj._id;
    Meteor.call('posts.deleteComment', postId, commentId,
      function deleteCommentCallback(err){
        if(err){
          alert(err);
        }
      });
  }

  render() {
    const comment = this.props.commentObj;
    const canDelete = (comment.owner === this.props.currentUser._id || this.props.currentUser.role === 2);
    const {username} = comment;
    const content = comment.content.split("\n").map((item, key) => (
      <span key={key}>
        {item}
        <br />
      </span>
    ));
    return(
      <div key={comment._id}>
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>

          <div style={{flexGrow: "1", margin: "10px 0"}}>
            <div style={{marginBottom: '10px'}}>
              <Link to={"/profile?" + queryString.stringify({username})}>{username}</Link> &nbsp;&nbsp;
              {content}
            </div>
            <DateView date={comment.date} />
          </div>

          {canDelete?
            <IconButton
              onTouchTap={this.delete.bind(this)}>
              <ActionClear />
            </IconButton>
            :
            <div style={{width: '48px'}}>{/*use the space that woulda been used for the delete button*/}</div>
          }

        </div>
        <Divider />
      </div>
    )
  }
}
