import React, {Component} from 'react';
import moment from 'moment';

export default class DateView extends Component {
  constructor(props){
    super(props);

    this.state = {
      content: moment(props.date).fromNow()
    }
  }

  componentDidMount = () => {
    this.timer = setInterval(() => {
      this.setState({
        content: moment(this.props.date).fromNow()
      })
    }, (this.props.interval || 10000));
  }

  componentWillUnmount() {
    if(this.timer) clearInterval(this.timer);
  }

  render() {
    return(
      <div style={{fontStyle: 'italic', color: "#9E9E9E", ...this.props.style}}>
        {this.state.content}
      </div>
    );
  }
}
