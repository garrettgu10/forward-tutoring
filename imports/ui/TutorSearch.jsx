import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import {Days} from '../constants/constants.js';
import CheckBox from 'material-ui/CheckBox';

Number.prototype.times = function(callback) {
  var result = [];

  for(var i = 0; i < this; i++){
    result[i] = callback(i);
  }

  return result;
}

export default class TutorSearch extends Component {

  constructor(props){
    super(props);

    var checkMatrix = [];

    for(var i = 0; i < 7; i++){
      checkMatrix[i] = [];
      for(var j = 0; j < 5; j++){
        checkMatrix[i][j] = false;
      }
    }

    this.state = {
      checkMatrix: checkMatrix
    }
  }

  handleCheck(i, j){
    var result = checkMatrix.map((row) => row.slice()); //copy array

    result[i][j] = !result[i][j];

    this.setState(
      checkMatrix: result
    )
  }

  render() {
    return (
      <div>test</div>
    )
  }
}

`<TableHeader>
  <TableRow>
    {5..times((i) => <TableHeaderColumn>{i+5}pm</TableHeaderColumn>)}
  </TableRow>
</TableHeader>
<TableBody>
  {this.state.checkMatrix.map((row, i) => {
    <TableRow>
      {row.map((checked, j) => {
        <TableRowColumn>
          {/*<Checkbox checked={checked} onCheck={this.handleCheck.bind(this, i, j)}/>*/}
          asdfasdf
        </TableRowColumn>
      })}
    </TableRow>
  })}
</TableBody>`
