import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';

class NameEnterField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.onEnter();
    }
  }

  handleEnter(event) {
    this.onEnter();
  }

  onEnter() {
    if (!this.state.value) {
      return;
    }
    this.setState({
      username: this.state.value
    });
    this.props.onUpdate(this.state.value);
    this.setState({value: ''});
  }

  render() {
    return (
      <div>
        <label>Your name: </label>
        <Input type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
        <Button onClick={this.handleEnter}>Enter</Button>
      </div>
    );
  }
}

export default NameEnterField;
