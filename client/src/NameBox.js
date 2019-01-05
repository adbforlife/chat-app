import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NameEnterField from './NameEnterField';
import NameDropdown from './NameDropdown';
import { Container, Row, Col, Badge } from 'reactstrap';

class NameBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownDisabled: true
    };

    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(val) {
    if (!val) return;
    this.props.onUpdate(val);
    this.setState({
      dropdownDisabled: false
    });
  }

  render() {
    let greeting;
    if (this.props.username) {
      greeting = <h3>Hello, <Badge color="secondary">{this.props.username}</Badge>!</h3>;
    }
    return (
      /*<div>
        {greeting}
        <NameEnterField username={this.props.username} onUpdate={this.onUpdate}/>
        <NameDropdown username={this.props.username} dropdownDisabled={this.state.dropdownDisabled} onConverse={this.props.onConverse} socket={this.props.socket}/>
      </div>*/
      
        <Row>
          <Col lg="auto" md="auto" sm="auto">
            {greeting}
            <NameEnterField username={this.props.username} onUpdate={this.onUpdate}/>
          </Col>
          <Col lg="auto" md="auto" sm="auto">
            <NameDropdown username={this.props.username} dropdownDisabled={this.state.dropdownDisabled} onConverse={this.props.onConverse} socket={this.props.socket}/>
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
