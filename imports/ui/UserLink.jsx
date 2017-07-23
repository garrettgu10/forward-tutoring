/**
 * Created by garrettgu on 7/20/17.
 */
import React, {Component} from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import {Link, Redirect} from 'react-router-dom';

String.prototype.colorCode = function() {
  var hash = this.split("").reduce((prev, next) => ((prev << 13) - prev + next.charCodeAt(0)) & 0xffffff, 0);

  return ("000000"+hash.toString(16)).slice(-6);
};

export default class UserLink extends Component {

  constructor(props){
    super(props);
    this.state={
      redirect: false
    }
  }

  handleTouchTap(){
    this.setState({redirect: true});
  }

  render() {
    if(this.state.redirect){
      return <Redirect to={"/profile/" + this.props.username} />;
    }
    return (
      <Chip style={this.props.style} onTouchTap={this.handleTouchTap.bind(this)}>
        <Avatar backgroundColor={"#" + this.props.username.colorCode()}>
          {this.props.username.charAt(0).toUpperCase()}
        </Avatar>
        {this.props.username}
      </Chip>
    )
  }
}
