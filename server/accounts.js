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

  user.profile = options.profile || {};
  return user;
});

Meteor.publish("user", (username) => {
  return Meteor.users.find({username: username});
});
