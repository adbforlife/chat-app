import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
import MessageBox from './MessageBox';
import NameBox from './NameBox';
import { Container, Row, Col } from 'reactstrap';
const socket = io('http://localhost:5001');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      rooms: []
    }
    //this.setState = this.setState.bind(this);
  }

  changeUserName = (name) => {
    if (this.state.username) {
      socket.emit('broadcast_del', this.state.username);
    }
    this.setState({
      username: name
    });
    socket.emit('broadcast_add', name);
  }

  componentDidMount() {
    //socket.join('room1')
    //var roster = io.sockets.clients('chatroom1');

    socket.emit('join', JSON.stringify({
      'username': this.state.username,
      'room': 'room'
    }));

    socket.on('username_request', () => {
      if (this.state.username) {
        socket.emit('init', this.state.username);
      }
    })
  }

  render() {
    let greeting;
    if (this.state.username) {
      greeting = <h1>Hello, {this.state.username}!</h1>;
    }
    return (
      <Container>
        <Row>
          <Col>
            {greeting}
            <NameBox onUpdate={this.changeUserName} socket={socket}/>
          </Col>
        </Row>
        <Row>
          <Col xs = "6" sm = "3">
            <MessageBox socket={socket} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
