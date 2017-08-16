import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Schools = new Mongo.Collection('schools');

if(Meteor.isServer) {
  Meteor.publish('schools', () => {
    return Schools.find({});
  })
}

Meteor.methods({
  'schools.insert'(name, key) {
    check(name, String);
    check(key, String);
    
    if(name.length === 0) {
      throw new Meteor.Error('bad-name', 'No name supplied');
    }

    if(name.length > 200) {
      throw new Meteor.Error('bad-name', 'The name is too long');
    }

    if(key.length === 0) {
      throw new Meteor.Error('bad-key', 'No key supplied');
    }

    if(key.length > 100) {
      throw new Meteor.Error('bad-key', 'The key is too long');
    }

    var user = Meteor.user();
    if(user.role !== 2) {
      throw new Meteor.Error('not-authorized', 'You are not an admin');
    }

    Schools.insert({name, key});
  },

  'schools.remove'(id) {
    check(id, String);

    var user = Meteor.user();
    if(user.role !== 2) {
      throw new Meteor.Error('not-authorized', 'You are not an admin');
    }

    Schools.remove(id);
  }
})