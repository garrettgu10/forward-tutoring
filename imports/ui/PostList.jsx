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

  if(Session.get('Forum.onlyShowUserPosts')){
    var subscription = Meteor.subscribe('myposts');
    var posts = Posts.find({owner: Meteor.userId()}, {sort: {modifiedDate: -1}});
  }else{
    var subscription = Meteor.subscribe('posts');
    var posts = Posts.find({}, {sort: {modifiedDate: -1}});
  }

  return{
    ready: subscription.ready(),
    posts: posts.fetch()
  }
}, PostList);
