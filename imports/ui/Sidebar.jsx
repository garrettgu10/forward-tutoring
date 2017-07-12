import React, {Component} from 'react';
import ReactRouter from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const NavLink = ReactRouter.NavLink;

export default class Sidebar extends Component{
  constructor(props){
    super(props);
    this.state = {open: false};
  }

  toggle() {
    this.setState({open: !this.state.open});
  }

  render(){
    return(
      <div>
        <Drawer open={this.state.open} docked={false}>

          <NavLink exact to='/' className='nav-link' onTouchTap={this.toggle.bind(this)}>
            <MenuItem>Main</MenuItem>
          </NavLink>

          <NavLink to='/Forum' className='nav-link' onTouchTap={this.toggle.bind(this)}>
            <MenuItem>Ask Questions</MenuItem>
          </NavLink>

          <NavLink to="/consistent" className='nav-link' onTouchTap={this.toggle.bind(this)}>
            <MenuItem>My Consistent Tutor</MenuItem>
          </NavLink>

        </Drawer>
      </div>
    )
  }
}
