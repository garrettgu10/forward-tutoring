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

export default class EditTutorProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeStep: 0
    }
  }

  handleNext() {
    if(this.state.activeStep == 0){
      this.setState({
        checkedTimes: this.chooseDate.getCheckedTimes()
      });
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
      case 1: return <ContactInfo currentUser={this.props.currentUser} />
      default: return (<div>Sorry, you shouldn't be here. Refresh the page and try again.</div>);
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
            label={this.state.activeStep === 1? "Submit": "Next"} />
        </div>
      </div>
    )
  }
}
