import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Posts = new Mongo.Collection('posts');

if(Meteor.isServer){
  Meteor.publish('posts', function postsPublication() {
    return Posts.find({});
  })

  Meteor.publish('comments', function commentsPublication(postId) {
    return Posts.find({}, {fields: {comemnts: 1}});
  })
}

Meteor.methods({
  'posts.insert'(title, content){
    check(title, String);
    check(content, String);

    if(!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.insert({
      title: title,
      content: content,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      date: new Date(),
      numComments: 0,
      comments: []
    })
  },

  'posts.remove'(postId){
    check(postId, String);

    const post = Posts.findOne(postId);
    if(post.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.remove(postId);
  },

  'posts.comment'(postId, content){
    check(content, String);

    //Add checks for tutor/owner status here when account system is done

    if(!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const comment = {
      _id: new Meteor.Collection.ObjectID(),
      content: content,
      owner: Meteor.userId(),
      username: Meteor.user().username
    }

    Posts.update(postId, {$push: {comments: comment}});
  }
})
