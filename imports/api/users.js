/**
 * Created by garrettgu on 7/19/17.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Users = Meteor.users;

Meteor.methods({
  'users.addTutorInfo'(checkedTimes, email, skype, description) {
    check(email, String);
    check(skype, String);
    check(description, String);

    if(!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not logged in');
    }

    if(email.length > 200) {
      throw new Meteor.Error('bad-email', 'Your email is too long');
    }else if(email.length === 0){
      throw new Meteor.Error('bad-email', 'An email is necessary');
    }

    if(skype.length > 200) {
      throw new Meteor.Error('bad-skype', 'Your Skype username is too long');
    }else if(skype.length === 0) {
      throw new Meteor.Error('bad-skype', 'A Skype username is necessary');
    }

    if(description.length > 7000) {
      throw new Meteor.Error('bad-description', 'Your description is too long');
    }

    if(checkedTimes.length === 0){
      throw new Meteor.Error('bad-checked-times', 'You must choose at least one time slot');
    }

    Users.update(this.userId, $set: {email: email, skype: skype, tutorProfile: {times: checkedTimes, description: description}});
  }
})
