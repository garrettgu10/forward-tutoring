/**
 * Created by garrettgu on 7/19/17.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Email} from 'meteor/email';
import {Accounts} from 'meteor/accounts-base'

export const Users = Meteor.users;

Meteor.methods({
  'users.sendEmail'() {
    if(!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not logged in');
    }

    this.unblock();
    
    if(!this.isSimulation){
      Accounts.sendVerificationEmail(this.userId);
    }
  },

  'users.addTutorInfo'(checkedTimes, skype, description) {
    check(skype, String);
    check(description, String);

    if(!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not logged in');
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

    Users.update(this.userId, {$set: {skype: skype, tutorProfile: {times: checkedTimes, description: description, students: []}}});
  },

  'users.updateContactInfo'(skype) {
    check(skype, String);

    if(!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not logged in');
    }

    if(skype.length > 200) {
      throw new Meteor.Error('bad-skype', 'Your Skype username is too long');
    }else if(skype.length === 0) {
      throw new Meteor.Error('bad-skype', 'A Skype username is necessary');
    }

    Users.update(this.userId, {$set: {skype: skype}});
  },

  'users.chooseTutor'(tutor, time) {
    check(tutor, String);
    check(time, Number);

    var student = this.userId;
    
    if(!student) {
      throw new Meteor.Error('not-authorized', 'You are not logged in');
    }

    var studentDoc = Users.find(student, {fields: {role: 1, tutor: 1}}).fetch()[0];
    
    if(studentDoc.role !== 0) {
      throw new Meteor.Error('not-authorized', 'You are not a student'+studentDoc.role);
    }

    if(studentDoc.tutor){
      throw new Meteor.Error('not-authorized', 'You already have a tutor');
    }

    if(!this.isSimulation){
      var tutorDoc = Users.find(tutor, {fields: {role: 1, 'tutorProfile.times': 1, 'tutorProfile.students': 1}}).fetch()[0];

      if(!tutorDoc || tutorDoc.role !== 1){
        throw new Meteor.Error('bad-tutor', 'The tutor does not exist');
      }

      if(!tutorDoc.tutorProfile || !tutorDoc.tutorProfile.times) {
        throw new Meteor.Error('bad-tutor', 'The tutor has not filled out their consistent profile yet');
      }

      if(tutorDoc.tutorProfile.times.indexOf(time) === -1){
        throw new Meteor.Error('bad-time', 'The tutor is not available at that time');
      }

      if(tutorDoc.tutorProfile.students.length >= 2) {
        throw new Meteor.Error('bad-tutor', 'The tutor already has the maximum number of students');
      }

      Users.update(tutor, {$push: {'tutorProfile.students': {id: student, time: time}}, $pull: {'tutorProfile.times': time}});
      Users.update(student, {$set: { tutor: {id: tutor, time: time} }});
    }
  }
})