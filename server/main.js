import { Meteor } from 'meteor/meteor';
import { Posts } from '../imports/api/posts.js';
import { Users } from '../imports/api/users.js';
import { Schools } from '../imports/api/schools.js';

const frequency = 3; //minutes
const numHours = frequency/60; //number of hours distributed for each checkpoint

SyncedCron.add({
  name: `Distribute hours every ${frequency} minutes`,
  schedule: function(parser){
    return parser.text(`every ${frequency} minutes`);
  },
  job: function() {
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    console.log(day, hour);
    Users.update(
      {'status.online': true, role: 1, 'instant.day': day, 'instant.hour': hour},
      {$inc: {hours: numHours}},
      {multi: true}
    );
  }
});

SyncedCron.start();

Meteor.startup(() => {
  // code to run on server at startup
});
