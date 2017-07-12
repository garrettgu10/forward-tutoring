import React, {Component} from 'react';
import ReactRouter from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const Posts = new Mongo.Collection('posts');

const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;

class Forum extends Component {
  constructor(props){
    super(props);

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

        <div>{this.props.posts.map((post) => {
          return (
            <div>
              <div>Title: {post.title}</div>
              <div>Content: {post.content}</div>
              <div>Owner: {post.owner}</div>
              <div>Username: {post.username}</div>
              <div>Date: {post.date}</div>
            </div>
          )
        })}</div>
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    posts: Posts.find({}).fetch(),
    currentUser: Meteor.user(),
  }
}, Forum);
