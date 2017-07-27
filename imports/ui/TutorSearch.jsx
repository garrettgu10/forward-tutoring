import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import {Days} from '../constants/constants.js';
import Checkbox from 'material-ui/CheckBox';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

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
    var result = this.state.checkMatrix.map((row) => row.slice()); //copy array

    result[i][j] = !result[i][j];

    this.setState({
      checkMatrix: result
    })
  }

  render() {
    return (
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn></TableHeaderColumn>
            {5..times((i) => (<TableHeaderColumn key={i}>{i+5}pm</TableHeaderColumn>))}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.state.checkMatrix.map((row, i) => {
            return(
              <TableRow key={i}>
                <TableRowColumn style={{textOverflow: 'clip'}}>{Days[i]}</TableRowColumn>
                {row.map((checked, j) => {
                  return(
                    <TableRowColumn key={i*5+j} onTouchTap={this.handleCheck.bind(this, i, j)}>
                      <Checkbox checked={checked} />
                    </TableRowColumn>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }
}

``
