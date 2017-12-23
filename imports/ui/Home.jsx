import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import {blue500, red500, green500} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';

import MoneyOff from 'material-ui/svg-icons/editor/money-off';
import Timeline from 'material-ui/svg-icons/action/timeline';
import People from 'material-ui/svg-icons/social/people';
import muiThemeable from 'material-ui/styles/muiThemeable';

import "../css/home.css"

const titleStyle = {
  fontSize: 40, 
  fontWeight: 100,
  textAlign: 'center',
  margin: '10px 0'
}

function MainSection({header, content, style, iconColor, ...props}) {

  const iconStyle = {
    paddingLeft: 40,
    width: 150,
    height: 150,
    paddingTop: 10,
    paddingBottom: 10,
    fill: iconColor
  }

  const contentStyle = {
    margin: '10px 0'
  }

  var Icon = props.icon;

  return (
    <Paper style={{width: 280, marginTop: 10, marginRight: 10, padding: 25, ...style}}>
      <h2 style={titleStyle}>{header}</h2>
      <Icon style={iconStyle}/>
      <div style={contentStyle}>
        {content}
      </div>
    </Paper>
  )
}

function FAQ({question, answer}) {
  const outerStyle = {
    marginTop: 30
  }

  const innerStyle = {
    textAlign: 'center'
  }

  return (
    <div style={outerStyle}>
      <div style={{fontWeight: 'bold', ...innerStyle}}>Q: {question}</div>
      <div style={innerStyle}>A: {answer}</div>
    </div>
  )
}

function EmailLink() {
  return (
    <a href="mailto:forwardtutoringexecs@gmail.com">forwardtutoringexecs@gmail.com</a>
  )
}

function Home(props){
  const containerStyles = {
    backgroundColor: props.muiTheme.palette.primary1Color,
    width: '100%',
    margin: '0'
  }

  const sectionHeaderStyles = {
    fontSize: 40, 
    fontWeight: 100, 
    textAlign: 'center', 
    marginTop: 50, 
    marginBottom: 20
  }

  const {currentUser} = props;
  return(
    <div>
      <div className="home_container" style={containerStyles}>
        <div className="masthead-container">
          <img className="home_logo" src="/forward_tutoring_logo.jpg" />
          <h1 className="home_title">Free, high-quality tutoring</h1>
          <h2 className="home_subtitle">Brought to you by the Texas Academy of Mathematics and Science</h2>
          <div style={{height: '20px'}}></div>
          {currentUser?
            <div>
              <Link to="/forum">
                <RaisedButton 
                  className="home_button" 
                  label={currentUser.role === 0? "Ask Questions" : "Forum"} />
              </Link>
              <Link to="/consistent">
                <RaisedButton 
                  className="home_button" 
                  label={currentUser.role === 0? "My Consistent Tutor" : "Consistent Tutoring"} />
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
          <div style={{height: '130px'}}></div>
        </div>
      </div>
      <div className="container">
        <h1 style={sectionHeaderStyles}> Why Forward Tutoring?</h1>
        <div style={{display: 'flex', alignItems: 'stretch', justifyContent: 'center', flexWrap: 'wrap'}}>
          <MainSection 
            header="Free" 
            icon={MoneyOff} 
            iconColor={green500}
            content="Forward Tutoring is a 501(c)(3) government certified nonprofit organization whose mission is to provide tutoring for students everywhere free of charge. We believe that learning should be accessible to every student anywhere, without any cost involved."
            />
          <MainSection 
            header="Efficient" 
            icon={Timeline} 
            iconColor={red500}
            content="Forward Tutoring provides students the opportunity to connect with a consistent tutor, who will assist them on a weekly basis. When these tutors are unavailable, or at any time, students can ask questions on a forum with its own group of assigned tutors."
            />
          <MainSection 
            header="Experienced" 
            icon={People} 
            iconColor={blue500}
            content={<div>Forward Tutoring recruits tutors from the <a href="http://tams.unt.edu">Texas Academy of Mathematics and Science</a>, an educational establishment at the University of North Texas in Denton, Texas.</div>}
            />
        </div>
        <h1 style={sectionHeaderStyles}>Frequently Asked Questions</h1>
        <FAQ
          question="How can I set up my school with Forward Tutoring?"
          answer={<span>Please email us at <EmailLink /> to arrange tutoring with us!</span>}
        />
        <FAQ
          question="How can I support Forward Tutoring?"
          answer="Your donations help us keep our site free and running. Check back here later for a link to our PayPal!"
        />
        <FAQ
          question="My consistent tutor isn’t online at the moment and I really need a question answered soon. What do I do?"
          answer="Feel free to post in the forum! We have tutors overlooking the forum every day."
        />
        <h1 style={sectionHeaderStyles}>Contact Info</h1>
        <div style={{textAlign: 'center'}}>If you have any questions or concerns regarding our website, forum, tutors, etc. feel free to email us at <EmailLink />!</div>
        <div style={{textAlign: 'center', marginTop: '50px'}}>Copyright © Forward Tutoring {new Date().getFullYear()}</div>
      </div>
    </div>
  )
}

export default muiThemeable()(Home);