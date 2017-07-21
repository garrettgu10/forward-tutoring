import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

import "../css/home.css"

export default function Home(props){
  return(
    <div className="home_container">
      <img className="home_logo" src="/forward_tutoring_logo.jpg" />
      <h1 className="home_title">Free, high-quality tutoring</h1>
      <h2 className="home_subtitle">Brought to you by the Texas Academy of Mathematics and Science</h2>
      {props.loggedIn?
        <div>
          <Link to="/forum">
            <RaisedButton className="home_button" label="Ask a question" primary={true}/>
          </Link>
          <Link to="/consistent">
            <RaisedButton className="home_button" label="My consistent tutor" secondary={true}/>
          </Link>
        </div>
        :
        <div>
          <Link to="/register">
            <RaisedButton className="home_button" label="Sign up" primary={true}/>
          </Link>
          <Link to="/login">
            <RaisedButton className="home_button" label="Log in" secondary={true}/>
          </Link>
        </div>
      }

    </div>
  )
}
