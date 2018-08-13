import React, {Component} from 'react';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Redirect} from 'react-router-dom';
import ChooseDate from '../ChooseDate.jsx';
import ContactInfo from '../ContactInfo.jsx';
import {Users} from '../../api/users.js';
import UserProfile from '../UserProfile.jsx';
import TimedRedirect from '../TimedRedirect.jsx';

const MAX_STEP = 1;

export default class EditTutorProfile extends Component {
  constructor(props){
    super(props);
    var {currentUser} = this.props;
    this.state = {
      activeStep: 0,
      success: false,
      checkedTimes: (currentUser.tutorProfile? currentUser.tutorProfile.times: [])
    }
  }

  handleNext() {
    if(this.state.activeStep === 0){
      this.setState({
        checkedTimes: this.chooseDate.getCheckedTimes()
      });
    }
    if(this.state.activeStep === MAX_STEP){
      let {email, skype, description} = this.contactInfoForm.getContactInfo();
      let checkedTimes = this.state.checkedTimes;
      Meteor.call('users.addTutorInfo', checkedTimes, skype, description,
        (err) => {
          if(err){
            alert(err);
          }else{
            this.setState({success: true});
          }
        }
      )
      return;
    }
    this.setState({
      activeStep: this.state.activeStep+1
    })
  }

  handlePrev() {
    if(this.state.activeStep === 1){
      var {email, skype, description} = this.contactInfoForm.getContactInfo();
      this.setState({
        email: email,
        skype: skype,
        description: description
      });
    }
    this.setState({
      activeStep: this.state.activeStep-1
    })
  }

  BodyPanel = ({activeStep}) => {
    switch(activeStep) {
      case 0: return (<ChooseDate checkedTimes={this.state.checkedTimes} ref={(ref) => {this.chooseDate = ref;}} />);
      case 1: return (
        <ContactInfo
          currentUser={this.props.currentUser}
          ref={(ref => {this.contactInfoForm = ref;})}
          email={this.state.email}
          skype={this.state.skype}
          description={this.state.description} />);
      default: return (<div>Sorry, you shouldn't be here. Refresh the page and try again.</div>);
    }
  }

  render() {
    if(!this.props.currentUser) {
      return (
        <Redirect to="/login" />
      )
    }

    if(!this.props.currentUser.emails[0].verified) {
      return (
        <TimedRedirect redirectTo="/verify" text="You must verify your email address before continuing." seconds={10} />
      )
    }

    if(this.props.currentUser.tutorProfile){
      var {students} = this.props.currentUser.tutorProfile;

      if(students && students.length !== 0) {
        return (
          <div>
            {
              students.map((student) => {
                return(
                  <UserProfile key={student.id} id={student.id} time={student.time} />
                )
              })
            }
          </div>
        )
      }
    }

    if(this.state.success){
      return (
        <TimedRedirect redirectTo="/" />
      )
    }

    if(!this.props.currentUser.consistent){
      return (
        <TimedRedirect redirectTo="/forum" text="You are not authorized to be a tutor for ForwardTutoring Live. Contact the Forward Tutoring execs to learn more." />
      )
    }

    return(
      <div className="container">
        <Stepper activeStep = {this.state.activeStep}>
          <Step>
            <StepLabel>Choose viable times</StepLabel>
          </Step>
          <Step>
            <StepLabel>Contact info</StepLabel>
          </Step>
        </Stepper>
        <this.BodyPanel activeStep={this.state.activeStep} />
        <div style={{marginTop: 12}}>
          <FlatButton
            label="Back"
            onTouchTap={this.handlePrev.bind(this)}
            disabled={this.state.activeStep === 0}
            style={{marginRight: 12}} />
          <RaisedButton
            onTouchTap={this.handleNext.bind(this)}
            primary={true}
            label={this.state.activeStep === MAX_STEP? "Submit": "Next"} />
        </div>
      </div>
    )
  }
}
