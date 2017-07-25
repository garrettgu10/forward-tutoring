import React, {Component} from 'react';
import ReactRouter from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

const NavLink = ReactRouter.NavLink;
const Link = ReactRouter.Link;


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
    return(
      <div>
        <Drawer
          open={this.state.open}
          docked={false}
          onRequestChange={(open) => this.setState({open})}>

          <Link to='/' className='nav-link' onTouchTap={toggle}>
            <MenuItem style={{fontSize: "25px", lineHeight: "64px"}}>
              <span style={{fontWeight: 800}}>forward</span><span style={{fontWeight: 100}}>tutoring</span>
            </MenuItem>
          </Link>

          <NavLink activeStyle={menuItemActiveStyle} exact to='/' className='nav-link' onTouchTap={toggle}>
            <MenuItem>Main</MenuItem>
          </NavLink>

          <NavLink activeStyle={menuItemActiveStyle} to='/forum' className='nav-link' onTouchTap={toggle}>
            <MenuItem>Ask Questions</MenuItem>
          </NavLink>

          <NavLink activeStyle={menuItemActiveStyle} to="/consistent" className='nav-link' onTouchTap={toggle}>
            <MenuItem>My Consistent Tutor</MenuItem>
          </NavLink>

        </Drawer>
      </div>
    )
  }
}
