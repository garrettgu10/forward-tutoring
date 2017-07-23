import React, {Component} from 'react';
import ReactRouter, {Redirect} from 'react-router-dom';

import PostForm from "./PostForm.jsx";
import PostList from './PostList.jsx';

import CheckBox from 'material-ui/CheckBox';

export default class Forum extends Component {
  constructor(props){
    super(props);
    this.state = {
      onlyShowUserPosts: true
    }
    Session.set('Forum.onlyShowUserPosts', this.state.onlyShowUserPosts);
  }

  toggleShowUserPosts() {
    Session.set('Forum.onlyShowUserPosts', !this.state.onlyShowUserPosts);
    this.setState({
      onlyShowUserPosts: !this.state.onlyShowUserPosts
    })

  }

  render () {
    if(!this.props.currentUser) {
      return (
        <Redirect to="/login" />
      )
    }

    return (
      <div>
        <PostForm />

        <br />
        <CheckBox
          label="Only show my posts"
          checked={this.state.onlyShowUserPosts}
          onCheck={this.toggleShowUserPosts.bind(this)} />

        <PostList filterUserPosts={this.state.onlyShowUserPosts} currentUser={this.props.currentUser}/>
      </div>
    )
  }
}
