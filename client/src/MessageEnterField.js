import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Button, 
  Input, 
  InputGroup, 
  InputGroupAddon } from 'reactstrap';

class MessageEnterField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      disabled: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  handleChange(event) {
    // Avoid empty messages.
    if (event.target.value) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
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

  // Handles user hitting enter or clicking button.
  onEnter() {
    if (!this.state.value) return;
    this.props.socket.emit('message', JSON.stringify({
      msg: this.state.value,
      username: this.props.username,
      other_user: this.props.other_user,
    }));
    this.setState({value: ''});
    this.setState({disabled: true});
  }

  render() {
    return (
      <InputGroup>
        <Input placeholder="Type a message..." type="text" 
          value={this.state.value} onChange={this.handleChange} 
          onKeyPress={this.handleKeyPress} />
        <InputGroupAddon addonType="append">
          <Button disabled={this.state.disabled} onClick={this.handleEnter}>
            Send
          </Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

MessageEnterField.propTypes = {
  username: PropTypes.string.isRequired,
  other_user: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired
};

export default MessageEnterField;
