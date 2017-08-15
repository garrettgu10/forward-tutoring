import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Schools = new Mongo.Collection('schools');

if(Meteor.isServer) {
  Meteor.publish('schools', () => {
    
  })
}