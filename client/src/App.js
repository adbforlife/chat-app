import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import MessageBox from './MessageBox';
import NameEnterField from './NameEnterField';
const socket = io('http://localhost:5001');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      test: "gg",
      response: false,
      endpoint: "http:127.0.0.1:5001"
    }
    this.setState = this.setState.bind(this);
  }

  changeUserName = (name) => {
    this.setState({
      username: name
    });
  }

  componentDidMount() {
    socket.emit('join', JSON.stringify({
      'username': this.state.username,
      'room': 'room'
    }));

    //socket.emit('message', "fuck");
    socket.on('message', (msg) => {
      this.setState({
        test: msg
      })
    });
  }

  render() {
    let greeting;
    if (this.state.username) {
      greeting = <h1>Hello, {this.state.username}!</h1>;
    }
    return (
      <div className="App">
        <header className="App-header">
          {greeting}
          <NameEnterField onUpdate={this.changeUserName} />
          <MessageBox socket={socket} />
          <p></p><p></p><p></p>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload {this.state.test}.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
