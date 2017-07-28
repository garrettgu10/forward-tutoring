import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import {Days, Timezones} from '../constants/constants.js';
import Checkbox from 'material-ui/CheckBox';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import MenuItem from 'material-ui/MenuItem';

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
      checkMatrix: checkMatrix,
      offset: 0
    }
  }

  handleCheck(i, j){
    var result = this.state.checkMatrix.map((row) => row.slice()); //copy array

    result[i][j] = !result[i][j];

    this.setState({
      checkMatrix: result
    })
  }

  toggleEntireRow(i){
    var result = this.state.checkMatrix.map((row) => row.slice());
    var want = true;

    if(result[i].indexOf(false) == -1){ //all checked
      want = false;
    }

    5..times((j) => {
      result[i][j] = want
    })

    this.setState({
      checkMatrix: result
    })
  }

  toggleEntireColumn(j){
    var result = this.state.checkMatrix.map((row) => row.slice());
    var want = false;

    7..times((i) => {
      if(result[i][j] === false) want = true;
    })

    7..times((i) => {
      result[i][j] = want;
    })

    this.setState({
      checkMatrix: result
    })
  }

  handleOffsetChange(event, index, value){
    this.setState({
      offset: value
    })
  }

  render() {
    return (
      <div className="container">
        <SelectField
          floatingLabelText="Timezone"
          value={this.state.offset}
          onChange={this.handleOffsetChange.bind(this)}>
          {Timezones.map((timezone) => (
            <MenuItem key={timezone.offset} value={timezone.offset} primaryText={timezone.name} />
          ))}
        </SelectField>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn></TableHeaderColumn>
              {5..times((i) => (
                <TableHeaderColumn
                  key={i}
                  onTouchTap={this.toggleEntireColumn.bind(this, i)}
                  style={{cursor: 'pointer'}}>
                  {i+5+this.state.offset}pm
                </TableHeaderColumn>))}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.checkMatrix.map((row, i) => {
              return(
                <TableRow key={i}>
                  <TableRowColumn
                    onTouchTap={this.toggleEntireRow.bind(this, i)}
                    style={{textOverflow: 'clip', cursor: 'pointer'}}>{Days[i]}</TableRowColumn>
                  {row.map((checked, j) => {
                    return(
                      <TableRowColumn style={{cursor: 'pointer'}} key={i*5+j} onTouchTap={this.handleCheck.bind(this, i, j)}>
                        <Checkbox checked={checked} />
                      </TableRowColumn>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }
}

``
