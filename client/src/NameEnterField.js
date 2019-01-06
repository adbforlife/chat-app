import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Button,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon } from 'reactstrap';

const maxLength = 20;

function NameInput(props) {
  if (!props.username) {
    return <Input invalid={props.invalid} placeholder="Type your name..."
      type="text" value={props.value} onChange={props.onChange} 
      onKeyPress={props.onKeyPress} />;
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
      invalid: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.changeValidity = this.changeValidity.bind(this);
  }

  handleChange(event) {
    // Dismiss invalid box when user starts typing.
    if (this.state.invalid) this.changeValidity(false);
    // Avoid username too long.
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

  // Call onUpdate passed from parent.
  onEnter() {
    // Avoid white spaces at beginning and end.
    let val = this.state.value.trim();
    if (!val) {
      this.setState({value: ''})
      return;
    }
    this.props.onUpdate(val);
    this.setState({value: ''});
  }

  changeValidity(val) {
    this.setState({
      invalid: val
    });
  }

  render() {
    return (
      <FormGroup>
        <InputGroup>
          <NameInput username={this.props.username} invalid={this.state.invalid}
          value={this.state.value} onChange={this.handleChange} 
          onKeyPress={this.handleKeyPress}/>
          <InputGroupAddon addonType="append">
            <NameEnterButton username={this.props.username}
            onClick={this.handleEnter} />
          </InputGroupAddon>
        </InputGroup>
        {
          this.state.invalid 
          ? <FormText>That name is already taken</FormText> 
          : null
        }
      </FormGroup>
    );
  }
}

NameEnterField.propTypes = {
  username: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default NameEnterField;
