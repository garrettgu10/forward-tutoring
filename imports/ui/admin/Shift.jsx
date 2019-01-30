import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/navigation/close'

import {Days} from '../../constants/constants.js';

const SHIFT_TIMES = [16, 17, 18, 19]

function convert24to12(hour){
    var num = (hour+11)%12 + 1;
    var suffix = hour < 12? 'AM': 'PM';
    return num + " " + suffix;
}

class Shift extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            currDay : this.props.day,
            currHour : this.props.hour,
        }
    }
    handleDayChange(event, index, value)
    {
        this.setState({currDay : value});
    }
    handleHourChange(event, index, value)
    {
        this.setState({currHour : value});
    }
    handleRemove()
    {
        //TODO: Implement call
        Meteor.call('user.removeShift', this.state.currDay, this.state.currHour);
    }
    render()
    {
        return (
            <div style={{display : 'flex'}}>
                <SelectField
                    floatingLabelText='Day'
                    value = {this.state.currDay}
                    onChange = {this.handleDayChange.bind(this)}
                >
                {Days.map((day, index) => {
                        return <MenuItem key={index} value={index} primaryText={Days[index]} />
                    })
                }
                </SelectField>
                <SelectField
                    style={{marginLeft : '10px'}}
                    floatingLabelText='Hour'
                    value = {this.state.currHour}
                    onChange={this.handleHourChange.bind(this)}
                >
                {SHIFT_TIMES.map((time) =>{
                    var foo = convert24to12(time);
                    return <MenuItem key = {time} value = {time} primaryText={foo}/>
                })}
                </SelectField>
                <IconButton onClick = {this.handleRemove.bind(this)}>
                    <Close />
                </IconButton>
            </div>
        );
    }
}

export default createContainer((props) => {
    var subscription = Meteor.subscribe('user.byId', Meteor.userId());
    var currUser = Meteor.users.find().fetch();
    return {
      ready: subscription.ready(),
      currUser: currUser
    };
  }, Shift)