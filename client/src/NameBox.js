import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NameEnterField from './NameEnterField';
import NameDropdown from './NameDropdown';
import { Row, Col, Badge } from 'reactstrap';

class NameBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownDisabled: true
    };
    this.dropdown = React.createRef();
    this.enterField = React.createRef();
    this.onUpdate = this.onUpdate.bind(this);
  }

  // Handle user entering username.
  onUpdate(val) {
    if (!val) return;
    if (this.dropdown.current.isInList(val)) {
      this.enterField.current.changeValidity(true);
      return;
    }
    this.props.onUpdate(val);
    this.setState({
      dropdownDisabled: false
    });
  }

  render() {
    let greeting;
    if (this.props.username) {
      greeting = (
        <h3>Hello, 
          <Badge color="secondary">{this.props.username}</Badge>!
        </h3>
      );
    }
    return (
      <Row>
        <Col lg="auto" md="auto" sm="auto">
          {greeting}
          <NameEnterField ref={this.enterField} username={this.props.username}
            onUpdate={this.onUpdate}/>
        </Col>
        <Col lg="auto" md="auto" sm="auto">
          <NameDropdown ref={this.dropdown} username={this.props.username}
            dropdownDisabled={this.state.dropdownDisabled} 
            onConverse={this.props.onConverse} socket={this.props.socket}/>
        </Col>
      </Row>
    );
  }
}

NameBox.propTypes = {
  username: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onConverse: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired
}

export default NameBox;
