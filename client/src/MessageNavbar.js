import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem, } from 'reactstrap';

class MessageNavbar extends Component {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.props.onClose(this.props.other_user);
  }

  render() {
    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand>{this.props.other_user}</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Button onClick={this.onClose} close />
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
