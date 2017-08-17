/**
 * Created by garrettgu on 7/20/17.
 */
import React, {Component} from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import {Link, Redirect} from 'react-router-dom';
import md5 from 'md5';

String.prototype.colorCode = function() {
  var hash = md5(this);

  return (hash).slice(-6);
};

export default class UserLink extends Component {

  constructor(props){
    super(props);
    this.state={
      redirect: false
    }
  }

  render() {
    return (
      <Chip style={this.props.style} onTouchTap={() => 0} containerElement={<Link to={"/profile/" + this.props.username} />}>
        <Avatar backgroundColor={"#" + this.props.username.colorCode()}>
          {this.props.username.charAt(0).toUpperCase()}
        </Avatar>
        {this.props.username}
      </Chip>
    )
  }
}
