import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';

let maxLength = 20;

function NameInput(props) {
  if (!props.username) {
    return <Input placeholder="Type your name... (e.g. Alice)" type="text" value={props.value} onChange={props.onChange} onKeyPress={props.onKeyPress} />;
  } else {
    return null;
  }
}

function NameEnterButton(props) {
  if (!props.username) {
    return <Button onClick={props.onClick}>Enter</Button>
  } else {
    return null;
  }
}

class NameEnterField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  handleChange(event) {
    if (event.target.value.length > maxLength) return;
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
    let val = this.state.value.trim();
    if (!val) {
      this.setState({value: ''})
      return;
    }
    this.props.onUpdate(val);
    this.setState({value: ''});
  }

  render() {
    return (
      <div>
        <NameInput username={this.props.username} value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
        <NameEnterButton username={this.props.username} onClick={this.handleEnter} />
      </div>
    );
  }
}

NameEnterField.propTypes = {
  username: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default NameEnterField;
