import React, {Component} from 'react';
import ReactRouter, {Link} from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';

import PostForm from "./PostForm.jsx";

import {Posts} from '../api/posts.js';
import Post from './Post.jsx';

const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Redirect = ReactRouter.Redirect;

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

    return (
      <div>
        <div>Hello user {this.props.currentUser.username}</div>
        <br />
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
  Meteor.subscribe('posts');
  return {
    posts: Posts.find({}, {sort: {date: -1}}).fetch()
  }
}, Forum);
