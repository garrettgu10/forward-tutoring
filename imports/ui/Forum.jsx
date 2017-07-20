import React, {Component} from 'react';
import ReactRouter, {Link} from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';

import PostForm from "./PostForm.jsx";

import {Posts} from '../api/posts.js';
import Post from './Post.jsx';

const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Redirect = ReactRouter.Redirect;

import CircularProgress from 'material-ui/CircularProgress';

class Forum extends Component {

  deletePost(postId){
    Meteor.call('posts.remove', postId);
  }

  render () {
    if(!this.props.currentUser) {
      return (
        <Redirect to="/login" />
      )
    }

    if(!this.props.ready){
      return (
        <div style={{textAlign: "center"}}>
          <CircularProgress size={80} thickness={5} />
        </div>
      )
    }

    return (
      <div>
        <PostForm />

        <div>
          {this.props.posts.map((post) => {
            return (
              <Post post={post}
                currentUser={this.props.currentUser}
                handleDelete={this.deletePost.bind(null, post._id)}
                comments={post.comments}
                key={post._id} />
            );
          })}
        </div>
      </div>
    )
  }
}

export default createContainer(() => {
  const subscription = Meteor.subscribe('posts');
  return {
    posts: Posts.find({}, {sort: {date: -1}}).fetch(),
    ready: subscription.ready()
  }
}, Forum);
