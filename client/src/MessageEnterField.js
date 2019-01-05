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
    if (!this.state.value) return;
    this.props.socket.emit('message', JSON.stringify({
      msg: this.state.value,
      username: this.props.username,
      other_user: this.props.other_user,
    }));
    this.setState({value: ''});
  }

  render() {
    return (
      <div>
        <Input placeholder="Type a message..." type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
        <Button onClick={this.handleEnter}>Enter</Button>
      </div>
    );
  }
}

MessageEnterField.propTypes = {
  username: PropTypes.string.isRequired,
  other_user: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired
};

export default MessageEnterField;
