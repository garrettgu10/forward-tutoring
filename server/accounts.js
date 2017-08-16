/**
 * Created by garrettgu on 7/19/17.
 */
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import {Schools} from '../imports/api/schools.js';

Accounts.urls.verifyEmail = (token) => {
  return Meteor.absoluteUrl("verify-email/"+token);
}

Accounts.emailTemplates.from = "Forward Tutoring <noreply@forwardtutoring.net>";
Accounts.emailTemplates.siteName="forwardtutoring.net";


Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Activate your Forward Tutoring account now!";
  },
  text(user, url) {
    return `Hello ${user.profile.fullName}!

Click on the link below to verify your email address. If it is not a link, simply copy and paste the URL into your browser's address bar.

${url}

Thanks!
Forward Tutoring`;
  }
}

Accounts.validateNewUser((user) => {
  switch(user.role) {
    case 0:
      var school = Schools.find({_id: user.schoolId}).fetch()[0];
      if(!school || school.key !== user.roleKey){
        throw new Meteor.Error('bad-key', 'Invalid registration key');
        return false;
      }
      break;
    case 1:
      if(user.roleKey !== 'ambitiousjeans'){
        throw new Meteor.Error('bad-key', 'Invalid registration key');
        return false;
      }
      break;
    case 2: 
      if(user.roleKey !== 'clevercrayon'){
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
})

Meteor.publish('user.tutorsByTimes', (times) => {
  return Meteor.users.find({role: 1, "tutorProfile.times": {$in: times}}, {fields: userFields});
})
