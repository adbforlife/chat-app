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
  }

  changeUsername = (name) => {
    if (this.state.username) {
      socket.emit('broadcast_del', this.state.username);
    }
    this.setState({
      username: name
    });
    socket.emit('broadcast_add', name);
  }

  addRoom = (other_user) => {
    for (var i = 0; i < this.state.rooms.length; i++) {
      if (this.state.rooms[i]['other_user'] === other_user)
        return false;
    }
    console.log("conversing with " + other_user);
    let room = {
      username: this.state.username,
      name: [this.state.username, other_user].sort().join(''),
      other_user: other_user,
      history: []
    }
    this.setState({
      rooms: [...this.state.rooms, room]
    });
    setTimeout(function () {
      console.log(this.state.rooms);
    }.bind(this), 3000);
    socket.emit('join', JSON.stringify(room))
  }

  componentDidMount() {

    /*socket.emit('join', JSON.stringify({
      'username': this.state.username,
      'room': 'room'
    }));*/

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
            <NameBox username={this.state.username} onUpdate={this.changeUsername} onConverse={this.addRoom} socket={socket}/>
          </Col>
        </Row>
        <Row>
          {this.state.rooms.map((room) => {
            return (
              <Col key={room['name']} xs="6" sm="3">
                <MessageBox key={room['name']} other_user={room['other_user']} history={room['history']} socket={socket} />
              </Col>
            )
          })}
        </Row>
      </Container>
    );
  }
}

export default App;
