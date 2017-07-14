import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class Post extends Component {

  render() {
    var post = this.props.post;
    return (
      <Card key={post._id} style={{marginTop: '25px'}}>
        <CardHeader
          title={post.title}
          subtitle={post.username}
        />
        <CardText>
          {post.content}
        </CardText>
        <CardActions>
          <FlatButton label={post.comments.length + " Comments"} />
          {this.props.currentUser._id == post.owner && <FlatButton label="Delete" onTouchTap={this.props.handleDelete} />}

        </CardActions>
      </Card>
    )
  }
}
