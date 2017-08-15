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

    }
  }
})