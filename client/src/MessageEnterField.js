import React, { Component } from 'react';

class MessageEnterField extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleEnter(event) {
    // TODO
    this.setState({value: ''});
    this.props.socket.emit('message', this.state.value);
  }

  render() {
    return (
      <div>
        <p>
          Message:
        </p>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.handleEnter}>Enter</button>
      </div>
    );
  }
}

export default MessageEnterField;
