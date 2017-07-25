import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import DateView from './DateView.jsx';
import ActionClear from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';

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
    return(
      <div key={comment._id}>
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>

          <div style={{flexGrow: "1", margin: "10px 0"}}>
            <div style={{marginBottom: '10px'}}>
              <Link to={"/profile/"+comment.username}>{comment.username}</Link> &nbsp;&nbsp;
              {comment.content}
            </div>
            <DateView date={comment.date} />
          </div>

          {comment.owner === this.props.currentUser._id?
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
