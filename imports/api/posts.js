import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Subjects} from '../constants/constants.js';

export const Posts = new Mongo.Collection('posts');

if(Meteor.isServer){
  Meteor.publish('posts', function postsPublication() {
    return Posts.find({});
  });

  Meteor.publish('myposts', function myPostsPublication(){
    const userId = Meteor.userId();
    if(!userId){
      throw new Meteor.Error('not-authorized');
    }

    return Posts.find({owner: userId});
  })

  Meteor.publish('comments', function commentsPublication(postId) {
    return Posts.find({}, {fields: {comemnts: 1}});
  });
}

Meteor.methods({
  'posts.insert'(title, content, subject){
    check(title, String);
    check(content, String);
    check(subject, String);

    if(!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', "You are not logged in");
    }

    if(title.length == 0){
      throw new Meteor.Error('bad-title', "The title cannot be empty");
    }

    if(title.length > 500){
      throw new Meteor.Error('bad-title', "The title is over 500 characters long");
    }

    if(content.length > 5000){
      throw new Meteor.Error('bad-content', 'The content is over 5000 characters long');
    }

    if(Subjects.indexOf(subject) < 0){
      throw new Meteor.Error('bad-subject', 'The subject doesn\'t exist');
    }

    Posts.insert({
      title: title,
      content: content,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      date: new Date(),
      modifiedDate: new Date(),
      numComments: 0,
      subject: subject,
      comments: []
    })
  },

  'posts.remove'(postId){
    check(postId, String);

    const post = Posts.findOne(postId);
    if(post.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized', "You do not own this post");
    }

    Posts.remove(postId);
  },

  'posts.comment'(postId, content){
    check(content, String);

    const user = Meteor.user();
    const post = Posts.findOne(postId);

    if(!user) {
      throw new Meteor.Error('not-authorized', 'You are not logged in');
    }

    if(user.role === 0 && user._id !== post.owner){ //the user is a student and not the owner of the post
      throw new Meteor.Error('not-authorized', 'You do not own this post');
    }

    if(content.length > 5000){
      throw new Meteor.Error('bad-content', 'The content is over 5000 characters long');
    }

    const comment = {
      _id: new Meteor.Collection.ObjectID()._str,
      content: content,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      date: new Date()
    }

    Posts.update(postId, {$push: {comments: comment}, $inc: {numComments: 1}, $set: {modifiedDate: comment.date}});
  },

  'posts.deleteComment'(postId, commentId){
    check(postId, String);
    check(commentId, String);

    const post = Posts.findOne(postId);

    const comment = post.comments.filter((comment) => comment._id == commentId)[0];

    if(!comment){
      throw new Meteor.Error('comment-not-found');
    }

    if(Meteor.userId() !== comment.owner){
      throw new Meteor.Error('not-authorized', 'You do not own this comment');
    }

    Posts.update(postId, {$pull: {comments: {_id: commentId}}, $inc: {numComments: -1}});
  }
});
