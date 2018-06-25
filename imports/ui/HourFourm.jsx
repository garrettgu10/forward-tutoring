import React, {Component} from 'react';

class HourFourm extends Component
{
    render()
    {
      return(
          <div className="container">
            <span>If you are currently receiving consistent tutoring, please fill our the following google form to log their hours.  If the embedded fourm does not work, click</span>
            <a href = "https://goo.gl/forms/DDLmboa67Zv3ovBB2" > here.</a>
            <iframe style={{marginTop : "25px"}} src="https://docs.google.com/forms/d/e/1FAIpQLSdJ5Gd4Tp7HoNzBoLsIq7U3Rc505YKgRvMLlUx9gMwUnHHAKw/viewform?embedded=true" width="100%" height="1000" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
          </div>
      );
    }
}

export default HourFourm;
