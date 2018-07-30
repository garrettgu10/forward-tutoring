import React, {Component} from 'react';
import {Posts} from '../api/posts.js';
import { createContainer } from 'meteor/react-meteor-data';
import Post from './Post.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

import {Subjects} from '../constants/constants.js';

const INITIAL_LOAD = 10; //number of posts loaded initially
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
    /*this.setState({loadingMore: true});
    Meteor.subscribe('posts', this.props.query, this.props.sort, this.numLoaded, ADDED_LOAD,
      {onReady: () => {
        this.setState({loadingMore: false});
      }}
    );
    this.numLoaded+=ADDED_LOAD;*/

    Session.set('Forum.numLoaded', Session.get('Forum.numLoaded') + ADDED_LOAD);
  }

  render() {
    var shouldShowLoadMore = (Session.get('Forum.numLoaded') === this.props.posts.length);

    if(this.props.posts.length === 0){
      if(!this.props.ready){
        return (
          <div style={{textAlign: "center"}}>
            <CircularProgress size={80} thickness={5} />
          </div>
        )
      }
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
        {!this.props.ready &&
          <div style={{textAlign: "center"}}>
            <CircularProgress size={80} thickness={5} />
          </div>
        }
      </div>
    );
  }
}

export default createContainer((props) => {

  const sortBy = Session.get('Forum.sortBy');

  const focusFilter = Session.get('Forum.filterByFocus');
  const filteredSubjects = [];

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

  switch(focusFilter)
  {
    case "none":
      filteredSubjects = Subjects;
      break;
    case "standardized":
      filteredSubjects = Subjects.slice(3, 6);
      break;
    case "traditional":
      filteredSubjects = Subjects.slice(0, 3);
      break;
    case "other":
      filteredSubjects = Subjects.slice(-1);
      break;
  }

  if(focusFilter !== 'none' && subjectFilter === 'all')
  {
    query.subject = {$in: filteredSubjects};
  }

  if(subjectFilter !== 'all'){
    query.subject = subjectFilter;
  }

  if(Session.get('Forum.onlyShowUserPosts')){
    query.owner = Meteor.userId();
  }

  Session.setDefault('Forum.numLoaded', INITIAL_LOAD);
  const numLoaded = Session.get('Forum.numLoaded');

  var initialized = false;

  var posts = Posts.find(query, {sort: sort, limit: numLoaded});

  posts.observeChanges({
    addedBefore(id, fields){
      if(initialized && fields.owner !== Meteor.userId()){
        //new Audio('new_post.mp3').play();
      }
    }
  })

  var subscription = Meteor.subscribe('posts', query, sort, 0, numLoaded, () => {
    initialized = true;
  });

  return {
    ready: subscription.ready(),
    posts: posts.fetch(),
    query: query,
    sort: sort
  }
}, PostList);
