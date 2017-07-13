import React, {Component} from 'react';
import ReactRouter from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import PostForm from "./PostForm.jsx";

import {Posts} from '../api/posts.js';

const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;

class Forum extends Component {

  deletePost(postId){
    Meteor.call('posts.remove', postId);
  }

  render () {
    if(!this.props.currentUser) {
      return (
        <div>
          You need to log in. &nbsp;&nbsp;
          <AccountsUIWrapper />
        </div>
      )
    }

    return (
      <div>
        <div>Hello user {this.props.currentUser.username}</div>
        <AccountsUIWrapper />
        <br />
        <PostForm />

        <div>
          {this.props.posts.map((post) => {
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
                  <FlatButton label={post.comments.length + " Comments"} />
                  {this.props.currentUser._id == post.owner && <FlatButton label="Delete" onTouchTap={this.deletePost.bind(null, post._id)} />}

                </CardActions>
              </Card>
            );
          })}
        </div>
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    posts: Posts.find({}, {sort: {date: -1}}).fetch(),
    currentUser: Meteor.user(),
  }
}, Forum);
