import React, {Component} from 'react';

import TextField from 'material-ui/TextField';

export default class ContactInfo extends Component {

  constructor(props){
    super(props);
    this.state= {
      email: this.props.currentUser.emails[0].address,
      skype: "",
      description: ""
    }
  }

  getContactInfo() {
    var result = {
      email: this.state.email,
      skype: this.state.skype,
      description: this.state.description
    }
    return result;
  }

  handleInputChange(field, event) {
    this.setState({
      [field]: event.target.value
    })
  }

  render() {
    const {role} = this.props.currentUser;
    return (
      <form>
        <TextField
          floatingLabelText="Email"
          value={this.state.email}
          onChange={this.handleInputChange.bind(this, "email")}
          hintText="Please use an email you check often."
          fullWidth={true} />
        <TextField
          floatingLabelText="Skype username"
          value={this.state.skype}
          onChange={this.handleInputChange.bind(this, "skype")}
          hintText="Remember to stay online during scheduled times!"
          fullWidth={true} />
        {role === 1 &&
          <TextField
            hintText="Describe yourself as a tutor! Include information like what classes you've taken, what you specialize in teaching, etc. This will be shown when students are looking for tutors. "
            multiLine={true}
            rows={2}
            floatingLabelText="Additional profile info"
            value={this.state.description}
            onChange={this.handleInputChange.bind(this, "description")}
            fullWidth={true} />
        }
      </form>
    )
  }
}
