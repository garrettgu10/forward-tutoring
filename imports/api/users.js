/**
 * Created by garrettgu on 7/19/17.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Email} from 'meteor/email';
import {Accounts} from 'meteor/accounts-base';
import {Days} from '../constants/constants.js';

export const Users = Meteor.users;

function getTimeDescription(timeNum) {
  var day = Math.floor(timeNum/5);
  var time = timeNum%5 + 5;
  return Days[day] + " " + time + " PM";
}

function tutorEmail(tutor, student, time) {
  return `Hi ${tutor.profile.fullName}, 

You have been assigned to a student for consistent tutoring.

Name: ${student.profile.fullName}
Email: ${student.emails[0].address}
Skype: ${student.skype}
Time: ${getTimeDescription(time)}

Head to the consistent tutoring portal on forwardtutoring.net to get more info.

In the meantime, please actively contact your student to set up tutoring. 

Thank you for volunteering with Forward Tutoring. 

The Forward Tutoring Team`;
}

Meteor.methods({
  'users.sendEmail'() {
    if(!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not logged in');
    }
    
    if(!this.isSimulation){
      var user = Meteor.user();
      var tokens = user.services.email? user.services.email.verificationTokens : null;
      
      if(tokens && tokens.length !== 0) {
        var then = tokens[tokens.length-1].when;
        var now = new Date();
        console.log(then, now);
        if(now-then < 300000) {
          throw new Meteor.Error('bad-timing', 'Please wait 5 minutes before sending another verification email');
        }
      }

      this.unblock();
      
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

  'users.setConsistent'(id, consistent) {
    check(id, String);

    if(Meteor.user().role !== 2) {
      throw new Meteor.Error('not-authorized', 'You are not an admin');
    }
    
    Users.update(id, {$set: {'consistent': consistent}});
  },

  'users.setInstant'(id, instant) {
    check(id, String);
    if(Meteor.user().role !== 2) {
      throw new Meteor.Error('not-authorized', 'You are not an admin');
    }

    Users.update(id, {$set : {'instant' : instant}});
  },

  'users.chooseTutor'(tutor, time) {
    check(tutor, String);
    check(time, Number);

    var student = this.userId;
    
    if(!student) {
      throw new Meteor.Error('not-authorized', 'You are not logged in');
    }

    var studentDoc = Users.find(student).fetch()[0];
    
    if(studentDoc.role !== 0) {
      throw new Meteor.Error('not-authorized', 'You are not a student'+studentDoc.role);
    }

    if(studentDoc.tutor){
      throw new Meteor.Error('not-authorized', 'You already have a tutor');
    }

    if(!this.isSimulation){
      var tutorDoc = Users.find(tutor).fetch()[0];

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

      Email.send({
        from: 'Forward Tutoring <noreply@forwardtutoring.net>',
        to: tutorDoc.emails[0].address,
        subject: 'Forward Tutoring Consistent Tutoring',
        html: tutorEmail(tutorDoc, studentDoc, time)
      })
    }
  }
})