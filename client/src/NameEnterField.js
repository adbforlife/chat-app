import React, { Component } from 'react';

class NameEnterField extends Component {
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
    if (event.key == 'Enter') {
      this.props.onUpdate(this.state.value);
      this.setState({value: ''});
    }
  }

  handleEnter(event) {
    this.setState({value: ''});
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
        <button onClick={this.handleEnter}>Enter</button>
      </div>
    );
  }
}

export default NameEnterField;
