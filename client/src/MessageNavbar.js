import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem, } from 'reactstrap';

class MessageNavbar extends Component {
  constructor(props) {
    super(props);
    this.finalCleanup = this.finalCleanup.bind(this);
  }

  // Clean up when user closes chatbox or refreshes or exits.
  finalCleanup() {
    this.props.onClose(this.props.other_user);
    window.removeEventListener('beforeunload', this.finalCleanup);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.finalCleanup);
  }

  render() {
    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand>{this.props.other_user}</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Button onClick={this.finalCleanup} close />
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

MessageNavbar.propTypes = {
  other_user: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default MessageNavbar;
