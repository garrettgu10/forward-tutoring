/**
 * Created by garrettgu on 7/19/17.
 */
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import {Schools} from '../imports/api/schools.js';
import {TUTOR_KEY, ADMIN_KEY} from './registration-keys.js';

Accounts.urls.verifyEmail = (token) => {
  return Meteor.absoluteUrl("verify-email/" + token);
}

Accounts.urls.resetPassword = (token) => {
  return Meteor.absoluteUrl('forgot-password/' + token);
}

Accounts.emailTemplates.from = "Forward Tutoring <noreply@forwardtutoring.net>";
Accounts.emailTemplates.siteName="forwardtutoring.net";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Welcome to Forward Tutoring";
  },
  text(user, url) {
    return `Hello ${user.profile.fullName},

Thank you for joining Forward Tutoring!

Please click on the link below to verify your email address. 

${url}

Thanks!
Forward Tutoring`;
  }
}

Accounts.emailTemplates.resetPassword = {
  subject() {
    return "Verify that it's you";
  },
  text(user, url) {
    return `Hello ${user.profile.fullName}!

Click on the link below to reset your password.

${url}

In case you forgot, your username is ${user.username}.

Cheers!
Forward Tutoring`
  }
}

Accounts.validateNewUser((user) => {
  if(user.username === "") {
    throw new Meteor.Error('bad-username', "Username may not be empty");
  }

  if(user.fullName === "") {
    throw new Meteor.Error("bad-name", "Name may not be empty");
  }

  if(user.emails[0] === "") {
    throw new Meteor.Error('bad-email', "Email may not be empty");
  }

  switch(user.role) {
    case 0:
      var school = Schools.find({_id: user.schoolId}).fetch()[0];
      if(!school || school.key !== user.roleKey){
        throw new Meteor.Error('bad-key', 'Invalid registration key');
        return false;
      }
      break;
    case 1:
      if(user.roleKey !== TUTOR_KEY){
        throw new Meteor.Error('bad-key', 'Invalid registration key');
        return false;
      }
      break;
    case 2: 
      if(user.roleKey !== ADMIN_KEY){
        throw new Meteor.Error('bad-key', 'Invalid registration key');
        return false;
      }
      break;
    default:
      throw new Meteor.Error('bad-role', 'Role does not exist');
      return false;
  }
  return true;
});

const userFields = {_id: 1, emails: 1, profile: 1, username: 1, createdAt: 1, role: 1, tutorProfile: 1, skype: 1, tutor: 1};

Accounts.onCreateUser((options, user) => {
  user.roleKey = options.roleKey || "";
  user.role = options.role || 0;
  user.schoolId = options.schoolId;
  user.school = options.school;

  user.profile = options.profile || {};
  return user;
});

Meteor.publish("user", (username) => {
  return Meteor.users.find({username: username}, {fields: userFields});
});

Meteor.publish("user.byId", (userId) => {
  return Meteor.users.find(userId, {fields: userFields})
});

Meteor.publish('user.tutorsByTimes', (times) => {
  return Meteor.users.find({role: 1, "tutorProfile.times": {$in: times}, "tutorProfile.students": {$not: { $size: 2 } } }, {fields: userFields});
});

Meteor.publish('users.onlineTutors', () => {
  return Meteor.users.find({'status.online': true, role: 1}, {fields: {_id: 1, username: 1, 'status.online': 1, role: 1} });
})
