import React, {Component} from 'react';
import TimeDiff from '../helpers/TimeDiff.js';

export default class DateView extends Component {
  constructor(props){
    super(props);

    this.state = {
      content: TimeDiff(props.date)
    }
  }

  componentDidMount = () => {
    this.timer = setInterval(() => {
      this.setState({
        content: TimeDiff(this.props.date)
      })
    }, (this.props.interval || 10000));
  }

  componentWillUnmount() {
    if(this.timer) clearInterval(this.timer);
  }

  render() {
    var {date} = this.props;
    return(
      <div title={date.toDateString()+" "+date.toLocaleTimeString()} style={{fontStyle: 'italic', color: "#9E9E9E", ...this.props.style}}>
        {this.state.content}
      </div>
    );
  }
}
