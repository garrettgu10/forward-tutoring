import React, {Component} from 'react';
import ReactRouter, {Redirect} from 'react-router-dom';

import PostForm from "./PostForm.jsx";
import PostList from './PostList.jsx';
import OnlineTutorsList from './OnlineTutorsList.jsx';

import CheckBox from 'material-ui/CheckBox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TimedRedirect from './TimedRedirect.jsx';

import {WaysToSortPosts, Subjects, PostStatusFilters} from '../constants/constants.js';

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function convert24to12(hour){
  var num = (hour+11)%12 + 1;
  var suffix = hour < 12? 'AM': 'PM';
  return num + " " + suffix;
}

String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function HoursDisplay({instant, hours}){
  return (
    <div style={{display: 'flex', margin: '0px 20px'}}>
      {instant && 
        <div style={{flexGrow: 1, marginRight: 10}}>
          <i>Assigned time:</i> {DAYS[instant.day]} {convert24to12(instant.hour)}-{convert24to12((instant.hour+1)%24)} Central
        </div>
      }
      {typeof hours !== 'undefined' && 
        <div>
          <i>Hours:</i> {hours.toFixed(2)}
        </div>
      }
    </div>
  )
}

export default class Forum extends Component {
  constructor(props){
    super(props);
    this.state = {
      onlyShowUserPosts: true,
      sortBy: 'Latest update',
      filterBySubject: 'all',
      filterByStatus: 'All'
    }

    if(this.props.currentUser && this.props.currentUser.role !== 0){
      this.state.onlyShowUserPosts = false; //if not student, default show all
    }

    Session.set('Forum.onlyShowUserPosts', this.state.onlyShowUserPosts);
    Session.set('Forum.sortBy', this.state.sortBy);
    Session.set('Forum.filterBySubject', this.state.filterBySubject);
    Session.set('Forum.filterByStatus', this.state.filterByStatus);
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

  handleFilterBySubjectChange(event, index, value){
    Session.set('Forum.filterBySubject', value);
    this.setState({
      filterBySubject: value
    })
  }

  handlefilterByStatusChange(event, index, value) {
    Session.set('Forum.filterByStatus', value);
    this.setState({
      filterByStatus: value
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
      <div className="container">
        <OnlineTutorsList />
        {this.props.currentUser.role === 1 && 
          <HoursDisplay instant={this.props.currentUser.instant} hours={this.props.currentUser.hours} />
        }
        {this.props.currentUser.role !== 1 && <PostForm />}

        <br />
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
          <SelectField
            style={selectFieldStyle}
            floatingLabelText="Filter by ownership"
            value={this.state.onlyShowUserPosts}
            onChange={this.handleShowPostsChange.bind(this)} >
            <MenuItem value={true} primaryText="Only my questions" />
            <MenuItem value={false} primaryText="Everyone's questions" />
          </SelectField>
          <SelectField
            style={selectFieldStyle}
            floatingLabelText="Filter by subject"
            value={this.state.filterBySubject}
            onChange={this.handleFilterBySubjectChange.bind(this)}>
            {Subjects.map((subject) => {
              return(
                <MenuItem key={subject} value={subject} primaryText={subject.capitalize()} />
              );
            })}
            <MenuItem key='all' value='all' primaryText='All' />
          </SelectField>
          <SelectField
            style={selectFieldStyle}
            floatingLabelText="Filter by status"
            value={this.state.filterByStatus}
            onChange={this.handlefilterByStatusChange.bind(this)}>
            {PostStatusFilters.map((status) => {
              return(
                <MenuItem key={status} value={status} primaryText={status.capitalize()} />
              );
            })}
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
        </div>

        <PostList filterUserPosts={this.state.onlyShowUserPosts} currentUser={this.props.currentUser}/>
      </div>
    )
  }
}
