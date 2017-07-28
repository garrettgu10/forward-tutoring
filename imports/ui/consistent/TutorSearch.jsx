import React, {Component} from 'react';
import ChooseDate from './ChooseDate.jsx';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class TutorSearch extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeStep: 0
    }
  }

  handleNext() {
    if(this.state.activeStep == 0){
      this.chooseDate.saveToSession();
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
      case 0: return <ChooseDate ref={(ref) => {this.chooseDate = ref;}} />;
      default: return (<div>hello</div>);
    }
  }

  render() {
    return(
      <div className="container">
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
            label="Next" />
        </div>
      </div>
    )
  }
}
