import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';

class MessageEnterField extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.props.socket.emit('message', this.state.value);
      this.setState({value: ''});
    }
  }

  handleEnter(event) {
    this.props.socket.emit('message', this.state.value);
    this.setState({value: ''});
  }

  render() {
    return (
      <div>
        <label>Message: </label>
        <Input placeholder="Type a message..." type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
        <Button onClick={this.handleEnter}>Enter</Button>
      </div>
    );
  }
}

MessageEnterField.propTypes = {
  socket: PropTypes.object.isRequired
};

export default MessageEnterField;
