import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MessageNavbar from './MessageNavbar';
import MessageBody from './MessageBody';
import MessageEnterField from './MessageEnterField';
import { Container, Row } from 'reactstrap'; 

class MessageBox extends Component {
  render() {
    return (
      <Container>
        <Row>
          <MessageNavbar />
        </Row>
        <MessageBody username={this.props.username} other_user={this.props.other_user} socket={this.props.socket} />
        <Row>
          <MessageEnterField username={this.props.username} other_user={this.props.other_user} socket={this.props.socket}/>
        </Row>
      </Container>
    );
  }
}

MessageBox.propTypes = {
  username: PropTypes.string.isRequired,
  other_user: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired
};

export default MessageBox;
