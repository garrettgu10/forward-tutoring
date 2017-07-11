import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactRouter from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Switch = ReactRouter.Switch;

//STUB COMPONENTS FOR TESTING ROUTES, WILL BE IN THEIR OWN FILES
//--------------------------------------------------------
var Home = function(props) {
  return <div>HAI WE IS AT HOME</div>;
}

var Forum = function(props) {
  return <div>HAI THIS IZ TLDR PLACE</div>;
}

var Consistent = function(props){
  return <div>DIS IS WARE PPL GOTS CONSISTNAT TUTERS</div>
}
//--------------------------------------------------------


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return(
      <MuiThemeProvider>
        <Router>
          <div>
            {/*probably add the top bar here*/}
            <Sidebar />
            <div className="main-container">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/forum" component={Forum} />
                <Route path="/consistent" component={Consistent} />
              </Switch>
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}
