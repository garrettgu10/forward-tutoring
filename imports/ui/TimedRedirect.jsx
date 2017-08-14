import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';

export default class TimedRedirect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsLeft: props.seconds || 5
    };
  }

  componentDidMount = () => {
    this.counter = setInterval(() => {
      this.setState({
        secondsLeft: this.state.secondsLeft-1
      });
    }, 1000);
  }

  componentWillUnmount = () => {
    clearInterval(this.counter);
  }

  render() {
    const redirectTo = this.props.redirectTo || "/";
    const text = this.props.text || "Success!";
    const {secondsLeft} = this.state;
    if(secondsLeft <= 0) {
      return(
        <Redirect to={redirectTo} />
      )
    }

    return (
      <div className="container">
        <div>{text}</div>
        <div>You will be redirected in {secondsLeft} seconds.</div>
        <Link to={redirectTo}>Redirect Now</Link>
      </div>
    )
  }
}