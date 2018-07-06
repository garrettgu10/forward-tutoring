import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import List from './List.jsx'


export default class UsersList extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      text : '',
    };
    Session.set('Admin.query', this.state.text);
  }

  handleChange(e)
  {
    var query = e.target.value;
    Session.set('Admin.query', query);
    this.state.text = query;
  }

  render() {
    return (
      <div className="container">
        <TextField
          ref="name"
          floatingLabelText="Name"
          fullWidth={true}
          onChange = {this.handleChange.bind(this)}/>
        <div className="container">
          <List />
        </div>
      </div>
    );
  }
}
