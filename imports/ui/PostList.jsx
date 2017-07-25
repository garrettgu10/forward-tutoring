import React, {Component} from 'react';
import {Posts} from '../api/posts.js';
import { createContainer } from 'meteor/react-meteor-data';
import Post from './Post.jsx';
import CircularProgress from 'material-ui/CircularProgress';

class PostList extends Component {

  render() {
    if(!this.props.ready){
      return (
        <div style={{textAlign: "center"}}>
          <CircularProgress size={80} thickness={5} />
        </div>
      )
    }

    if(this.props.posts.length === 0){
      return(
        <div style={{marginTop: "20px"}}>No posts found.</div>
      )
    }

    return(
      <div>
        {this.props.posts.map((post) => {
          return (
            <Post post={post}
              currentUser={this.props.currentUser}
              comments={post.comments}
              key={post._id} />
          );
        })}
      </div>
    );
  }
}

export default createContainer((props) => {

  var sortBy = Session.get('Forum.sortBy');

  var query = {};

  switch(sortBy){
    case 'Latest update':
      var sort = {modifiedDate: -1};
      break;
    case 'Date of creation':
      var sort = {date: -1};
      break;
    default:
      var sort = {modifiedDate: -1};
  }

  if(Session.get('Forum.onlyShowUserPosts')){
    var subscription = Meteor.subscribe('myposts');
    query.owner = Meteor.userId();
  }else{
    var subscription = Meteor.subscribe('posts');
  }

  var posts = Posts.find(query, {sort: sort});

  return{
    ready: subscription.ready(),
    posts: posts.fetch()
  }
}, PostList);
