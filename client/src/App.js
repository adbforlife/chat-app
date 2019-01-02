import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import MessageBox from './MessageBox'
const socket = io('http://localhost:5001');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "gg",
      response: false,
      endpoint: "http:127.0.0.1:5001"
    }
  }

  componentDidMount() {
    //socket.emit('message', "fuck");
    socket.on('message', (msg) => {
      this.setState({
        test: msg
      })
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
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
