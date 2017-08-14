import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import TimedRedirect from '../TimedRedirect.jsx';

export default class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      ready: false
    }
  }
  
  componentDidMount() {
    var {token} = this.props.match.params;

    Accounts.verifyEmail(token, (err = "") => {
      this.setState({
        ready: true,
        error: err
      });
    })
  }

  render() {
    if(!this.state.ready) {
      return (
        <div style={{textAlign: "center"}}>
          <CircularProgress size={80} thickness={5} />
        </div>
      );
    }

    if(!this.state.error) {
      return (
        <TimedRedirect />
      )
    }

    return (
      <div className="container">
        We couldn't verify your email because of the following error: <br />
        {this.state.error.toString()}
      </div>
    )
  }
}