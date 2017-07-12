import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';

import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App.jsx';

// Needed for onTouchTap from material-ui
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Meteor.startup(function() {
  render(<App />, document.getElementById('render-container'));
})
