/**
 * Created by garrettgu on 7/19/17.
 */
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';

Accounts.validateNewUser((user) => {
  if(user.roleKey !== "temp"){
    throw new Meteor.Error("bad-key", "Invalid Registration Key");
  }
  return true;
});

Accounts.onCreateUser((options, user) => {
  user.roleKey = options.roleKey || "";
  user.role = options.role || 0;

  user.profile = options.profile || {};
  return user;
});

Meteor.publish("user", (username) => {
  return Meteor.users.find({username: username}, {fields: {emails: 1, profile: 1, username: 1, createdAt: 1, role: 1}});
});

Meteor.publish("user.byId", (userId) => {
  return Meteor.users.find(userId, {fields: {_id: 1, emails: 1, profile: 1, username: 1, createdAt: 1, role: 1}})
})
