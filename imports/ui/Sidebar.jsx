import React, {Component} from 'react';
import ReactRouter from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const NavLink = ReactRouter.NavLink;

export default class Sidebar extends Component{
  render(){
    return(
      <div>
        <Drawer open={true}>

          <NavLink exact to='/'>
            <MenuItem>Main</MenuItem>
          </NavLink>

          <NavLink to='/Forum'>
            <MenuItem>Ask Questions</MenuItem>
          </NavLink>

          <NavLink to="/consistent">
            <MenuItem>My Consistent Tutor</MenuItem>
          </NavLink>

        </Drawer>
      </div>
    )
  }
}
