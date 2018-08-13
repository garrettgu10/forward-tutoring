import React, {Component} from 'react';
import ReactRouter from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

const NavLink = ReactRouter.NavLink;
const Link = ReactRouter.Link;

import queryString from 'query-string';

var Logout = function() {
  Meteor.logout(function(err){
    if(err) alert(err);
  });
}

export default class Sidebar extends Component{
  constructor(props){
    super(props);
    this.state = {open: false};
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  render(){
    var toggle = this.handleToggle.bind(this);
    const menuItemActiveStyle = {};
    const {currentUser} = this.props;
    return(
      <div>
        <Drawer
          open={this.state.open}
          docked={false}
          onRequestChange={(open) => this.setState({open})}>

          <Link to='/' className='nav-link' onTouchTap={toggle}>
            <MenuItem style={{fontSize: "25px", lineHeight: "64px"}}>
              <span style={{fontWeight: 600}}>forward</span>
              <span style={{fontWeight: 300}}>tutoring</span>
            </MenuItem>
          </Link>

          <NavLink activeStyle={menuItemActiveStyle} exact to='/' className='nav-link' onTouchTap={toggle}>
            <MenuItem>Main</MenuItem>
          </NavLink>

          {currentUser?
            <div>
              <NavLink activeStyle={menuItemActiveStyle} to='/forum' className='nav-link' onTouchTap={toggle}>
                <MenuItem>
                  {currentUser.role === 0? "Ask Questions" : "Forum"}
                </MenuItem>
              </NavLink>

              {currentUser.role !== 2 &&
                <NavLink activeStyle={menuItemActiveStyle} to="/consistent" className='nav-link' onTouchTap={toggle}>
                  <MenuItem>
                    {currentUser.role === 0 ? "ForwardTutoring Live" : "ForwardTutoring Live for Tutors"}
                  </MenuItem>
                </NavLink>
              }

              {currentUser.role === 2 &&
                <NavLink activeStyle={menuItemActiveStyle} to="/admin/schools" className='nav-link' onTouchTap={toggle}>
                  <MenuItem>
                    Schools
                  </MenuItem>
                </NavLink>
              }

              {currentUser.role === 2 &&
                <NavLink activeStyle={menuItemActiveStyle} to="/admin/users" className='nav-link' onTouchTap={toggle}>
                  <MenuItem>
                    Users
                  </MenuItem>
                </NavLink>
              }
              
              {currentUser.role === 0 &&
                <NavLink activeStyle={menuItemActiveStyle} to='/logtutorhours' className='nav-link' onTouchTap={toggle}>
                  <MenuItem>
                    Log Tutor Hours
                  </MenuItem>
                </NavLink>
              }

              <br />

              <NavLink activeStyle={menuItemActiveStyle} to={"/profile?" + queryString.stringify({username: currentUser.username})} className='nav-link' onTouchTap={toggle}>
                <MenuItem>
                  My Profile
                </MenuItem>
              </NavLink>
              <MenuItem onClick={Logout}>
                Log Out
              </MenuItem>
            </div>
            :
            <div>
              <NavLink activeStyle={menuItemActiveStyle} to="/login" className='nav-link' onTouchTap={toggle}>
                <MenuItem>
                  Log in
                </MenuItem>
              </NavLink>
              <NavLink activeStyle={menuItemActiveStyle} to="/register" className='nav-link' onTouchTap={toggle}>
                <MenuItem>
                  Sign up
                </MenuItem>
              </NavLink>
            </div>
          }
        </Drawer>
      </div>
    )
  }
}
