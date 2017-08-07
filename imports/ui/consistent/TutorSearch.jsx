import React, {Component} from 'react';
import ChooseDate from '../ChooseDate.jsx';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Redirect} from 'react-router-dom';
import ContactInfo from '../ContactInfo.jsx';
import TutorsList from './TutorsList.jsx';

const MAX_STEP = 2;

export default class TutorSearch extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeStep: 0
    }
  }

  handleNext() {
    if(this.state.activeStep === 0){
      this.setState({
        checkedTimes: this.chooseDate.getCheckedTimes(),
        dateOffset: this.chooseDate.getOffset()
      });
    }

    if(this.state.activeStep === 1){
      var tutorChoice = this.chooseTutor.getChoice();
      if(!tutorChoice.valid){
        alert("Error: no tutor chosen");
        return;
      }
      this.setState({
        tutorChoice: tutorChoice
      })
    }

    if(this.state.activeStep == MAX_STEP){
      //submit stuff
    }
    this.setState({
      activeStep: this.state.activeStep+1
    })
  }

  handlePrev() {
    this.setState({
      activeStep: this.state.activeStep-1
    })
  }

  BodyPanel = ({activeStep}) => {
    switch(activeStep) {
      case 0: return <ChooseDate checkedTimes={this.state.checkedTimes} ref={(ref) => {this.chooseDate = ref;}} />;
      case 1: return <TutorsList dateOffset={this.state.dateOffset} times={this.state.checkedTimes} ref={(ref) => {this.chooseTutor = ref;}} />;
      case 2: return <ContactInfo currentUser={this.props.currentUser} />;
      default: return (<div>You shouldn't be here. Please refresh this page.</div>);
    }
  }

  render() {
    if(!this.props.currentUser) {
      return (
        <Redirect to="/login" />
      )
    }

    return(
      <div className="container">
        <h1 style={{fontSize: '30px', fontWeight: '200', marginBottom: '20px'}}>Find a Consistent Tutor</h1>
        <Stepper activeStep = {this.state.activeStep}>
          <Step>
            <StepLabel>Choose viable times</StepLabel>
          </Step>
          <Step>
            <StepLabel>Choose a tutor</StepLabel>
          </Step>
          <Step>
            <StepLabel>Verify contact info</StepLabel>
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
