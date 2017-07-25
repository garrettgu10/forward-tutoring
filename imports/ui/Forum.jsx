import React, {Component} from 'react';
import ReactRouter, {Redirect} from 'react-router-dom';

import PostForm from "./PostForm.jsx";
import PostList from './PostList.jsx';

import CheckBox from 'material-ui/CheckBox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {WaysToSortPosts} from '../constants/constants.js';

export default class Forum extends Component {
  constructor(props){
    super(props);
    this.state = {
      onlyShowUserPosts: true,
      sortBy: 'Latest update'
    }

    if(this.props.currentUser.role !== 0){
      this.state.onlyShowUserPosts = false; //if not student, default show all
    }

    Session.set('Forum.onlyShowUserPosts', this.state.onlyShowUserPosts);
    Session.set('Forum.sortBy', this.state.sortBy);
  }

  handleShowPostsChange(event, index, value) {
    Session.set('Forum.onlyShowUserPosts', value);
    this.setState({
      onlyShowUserPosts: value
    })

  }

  handleSortByChange(event, index, value) {
    Session.set('Forum.sortBy', value);
    this.setState({
      sortBy: value
    });
  }

  render () {
    const selectFieldStyle = {
      marginRight: '10px'
    }

    if(!this.props.currentUser) {
      return (
        <Redirect to="/login" />
      )
    }

    return (
      <div>
        <PostForm />

        <br />
        <SelectField
          style={selectFieldStyle}
          floatingLabelText="Show"
          value={this.state.onlyShowUserPosts}
          onChange={this.handleShowPostsChange.bind(this)} >
          <MenuItem value={true} primaryText="Only my posts" />
          <MenuItem value={false} primaryText="All posts" />
        </SelectField>
        <SelectField
          style={selectFieldStyle}
          floatingLabelText="Sort by"
          value={this.state.sortBy}
          onChange={this.handleSortByChange.bind(this)}>
          {WaysToSortPosts.map((method) => {
            return(
              <MenuItem key={method} value={method} primaryText={method} />
            )
          })}
        </SelectField>

        <PostList filterUserPosts={this.state.onlyShowUserPosts} currentUser={this.props.currentUser}/>
      </div>
    )
  }
}
