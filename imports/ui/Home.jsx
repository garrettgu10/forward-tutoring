import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import {blue500} from 'material-ui/styles/colors';

import "../css/home.css"

export default function Home(props){
  const containerStyles = {
    backgroundColor: blue500,
    width: '100%',
    margin: '0'
  }

  return(
    <div>
      <div className="home_container" style={containerStyles}>
        <div className="masthead-container">
          <img className="home_logo" src="/forward_tutoring_logo.jpg" />
          <h1 className="home_title">Free, high-quality tutoring</h1>
          <h2 className="home_subtitle">Brought to you by the Texas Academy of Mathematics and Science</h2>
          <div style={{height: '20px'}}></div>
          {props.loggedIn?
            <div>
              <Link to="/forum">
                <RaisedButton className="home_button" label="Ask a question" />
              </Link>
              <Link to="/consistent">
                <RaisedButton className="home_button" label="My consistent tutor" />
              </Link>
            </div>
            :
            <div>
              <Link to="/register">
                <RaisedButton className="home_button" label="Sign up" />
              </Link>
              <Link to="/login">
                <RaisedButton className="home_button" label="Log in" />
              </Link>
            </div>
          }
          <div style={{height: '100px'}}></div>
        </div>
      </div>
      <div style={{textAlign: 'center', marginTop: '20px'}}>More info coming soon!</div>
    </div>
  )
}
