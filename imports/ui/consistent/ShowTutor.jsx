import React, {Component} from 'react';
import UserProfile from '../UserProfile.jsx';

export default class ShowTutor extends Component {
  render() {
    return (
      <UserProfile id={this.props.id} time={this.props.time} />
    )
  }
}