import React, {Component} from 'react';
import {Posts} from '../api/posts.js';
import { createContainer } from 'meteor/react-meteor-data';
import Post from './Post.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

const INITIAL_LOAD = 5; //number of posts loaded initially
const ADDED_LOAD = 5; //number of posts loaded each time the button is pressed

class PostList extends Component {

  constructor(props) {
    super(props);
    this.numLoaded = INITIAL_LOAD;
    this.state = {
      loadingMore: false
    }
  }

  loadMore() {
    this.setState({loadingMore: true});
    Meteor.subscribe('posts', this.props.query, this.props.sort, this.numLoaded, this.numLoaded+ADDED_LOAD, 
      {onReady: () => {
        this.setState({loadingMore: false});
      }}
    );
    this.numLoaded+=ADDED_LOAD;
  }

  render() {
    var shouldShowLoadMore = (this.props.posts.length === this.numLoaded);
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
        <br />
        {shouldShowLoadMore && 
          <RaisedButton onClick={this.loadMore.bind(this)} label="load more" disabled={this.state.loadingMore} primary={true} fullWidth={true} />
        }
      </div>
    );
  }
}

export default createContainer((props) => {

  const sortBy = Session.get('Forum.sortBy');

  const subjectFilter = Session.get('Forum.filterBySubject');

  const statusFilter = Session.get('Forum.filterByStatus');

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

  switch(statusFilter){
    case 'Answered only':
      query.answered = true;
      break;
    case 'Unanswered only':
      query.answered = false;
      break;
    default:
      //do nothing
  }

  if(subjectFilter !== 'all'){
    query.subject = subjectFilter;
  }

  if(Session.get('Forum.onlyShowUserPosts')){
    query.owner = Meteor.userId();
  }
  
  var subscription = Meteor.subscribe('posts', query, sort, 0, INITIAL_LOAD);

  var posts = Posts.find(query, {sort: sort});

  return{
    ready: subscription.ready(),
    posts: posts.fetch(),
    query: query,
    sort: sort
  }
}, PostList);
