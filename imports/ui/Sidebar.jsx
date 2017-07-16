import React, {Component} from 'react';
import ReactRouter from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

const NavLink = ReactRouter.NavLink;


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
    return(
      <div>
        <Drawer
          open={this.state.open}
          docked={false}
          onRequestChange={(open) => this.setState({open})}>

          <MenuItem onTouchTap={toggle}>
            <FontIcon
              className="material-icons" style={{paddingTop: '16px'}}>
              arrow_back
            </FontIcon>
          </MenuItem>

          <NavLink exact to='/' className='nav-link' onTouchTap={toggle}>
            <MenuItem>Main</MenuItem>
          </NavLink>

          <NavLink to='/forum' className='nav-link' onTouchTap={toggle}>
            <MenuItem>Ask Questions</MenuItem>
          </NavLink>

          <NavLink to="/consistent" className='nav-link' onTouchTap={toggle}>
            <MenuItem>My Consistent Tutor</MenuItem>
          </NavLink>

          <NavLink to='/register' className='nav-link' onTouchTap={toggle}>
            <MenuItem>Register</MenuItem>
          </NavLink>

        </Drawer>
      </div>
    )
  }
}
