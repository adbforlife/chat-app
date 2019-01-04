import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MessageEnterField from './MessageEnterField';
import { Button, Container, Row, Col } from 'reactstrap'; 


function ListItem(props) {
  return <li>{props.value}</li>;
}

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: []
    };
  }

  componentDidMount() {
    this.props.socket.on('message', (username,msg,room) => {
      if (room !== this.props.room) return;
      this.setState({
        listItems: [...this.state.listItems, username + ": " + msg]
      });
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Button close />
        </Row>
        <Row>
          <Col>
            <ul>
              {this.state.listItems.map((item, index) =>
                <ListItem key={index} value={item}/>
              )}
            </ul>
          </Col>
        </Row>
        <Row>
          <MessageEnterField username={this.props.username} room={this.props.room} socket={this.props.socket}/>
        </Row>
      </Container>
    );
  }
}

MessageBox.propTypes = {
  username: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired
};

export default MessageBox;
