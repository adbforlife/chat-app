import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
import MessageBox from './MessageBox';
import NameBox from './NameBox';
import { Navbar, NavbarBrand, Container, Row } from 'reactstrap';
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);
const socket = io('http://localhost:5001');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      currRooms: [],
      storedRooms: []
    }

    this.storeRoom = this.storeRoom.bind(this);
    this.hydrateStateWithLocalStorage = 
      this.hydrateStateWithLocalStorage.bind(this);
    this.saveRoomsToLocalStorage = this.saveRoomsToLocalStorage.bind(this);
    this.getRoomName = this.getRoomName.bind(this);
    this.finalCleanup = this.finalCleanup.bind(this);
  }

  // Clean up before user exits or refreshes.
  finalCleanup() {
    socket.emit('broadcast_del', this.state.username);
    window.removeEventListener('beforeunload', this.finalCleanup);
  }

  // Store room history upon exiting chat rooms or exiting page.
  storeRoom(username,other_user,room_name,history) {
    // Update history if room already exists.
    for (var i = 0; i < this.state.storedRooms.length; i++) {
      if (this.state.storedRooms[i]['room_name'] === room_name) {
        let room = this.state.storedRooms[i];
        room['history'] = history;
        this.saveRoomsToLocalStorage();
        return;
      }
    }
    // Add history if room does not exist.
    this.setState({
      storedRooms: [...this.state.storedRooms, {
        username: username,
        other_user: other_user,
        room_name: room_name,
        history: history
      }]
    }, () => {
      this.saveRoomsToLocalStorage();
      socket.emit('hydrate');
    });
  }

  // Load chat history from local storage.
  hydrateStateWithLocalStorage() {
    let key = 'storedRooms'
    if (localStorage.hasOwnProperty(key)) {
      let value = localStorage.getItem(key);
      try {
        value = JSON.parse(value);
        this.setState({ storedRooms: value });
      } catch (e) {
        // Handle empty string.
        this.setState({ storedRooms: value });
      }
    }
  }

  // Save chat history to local storage.
  saveRoomsToLocalStorage() {
    localStorage.setItem('storedRooms',JSON.stringify(this.state.storedRooms));
  }

  // Register username when user enters; passed to children.
  changeUsername = (name) => {
    if (this.state.username) {
      return;
    }
    this.setState({
      username: name
    }, () => {
      socket.emit('broadcast_add', name);
    });
  }

  // Construct room name from users.
  getRoomName(username, other_user) {
    return [this.state.username, other_user].join('');
  }

  // Add to list of current rooms (and checking if there's stored history)
  addRoom = (other_user) => {
    // Abort if room already exists on page.
    for (var i = 0; i < this.state.currRooms.length; i++) {
      if (this.state.currRooms[i]['other_user'] === other_user)
        return false;
    }
    let room_name = this.getRoomName(this.state.username, other_user);
    var history = []
    // Check stored history for the specific room.
    for (var j = 0; j < this.state.storedRooms.length; j++) {
      if (this.state.storedRooms[j]['room_name'] === room_name 
        && this.state.storedRooms[j]['username'] === this.state.username) {
        history = this.state.storedRooms[j]['history'];
        break;
      }
    }
    // Update state of current rooms.
    this.setState({
      currRooms: [...this.state.currRooms, {
        username: this.state.username,
        name: room_name,
        other_user: other_user,
        history: history
      }]
    });
    // Join room on server.
    socket.emit('join', JSON.stringify({
      username: this.state.username,
      other_user: other_user
    }));
  }

  // Handles deleting room in all situations.
  delRoom = (other_user) => {
    let room_name = this.getRoomName(this.state.username, other_user);
    var history = [];
    // Extract room history before deleting.
    this.setState({currRooms: this.state.currRooms.filter(function(room) { 
        let same_name = (room['name'] === room_name);
        if (same_name) {
          history = room['history'];
        }
        return !same_name;
    })}, () => {
      let room = {
        username: this.state.username,
        other_user: other_user,
      }
      socket.emit('leave', JSON.stringify(room));
      this.storeRoom(this.state.username, other_user, room_name, history);
    });
  }

  componentDidMount() {
    // Set background color.
    document.body.style = 'background: #f0f0f0;';
    // Get chat history from local storage.
    this.hydrateStateWithLocalStorage();
    // Handles server requesting username.
    socket.on('username_request', () => {
      if (this.state.username) {
        socket.emit('broadcast_add', this.state.username);
      }
    });
    // Handles server requesting history update (mainly for local purposes).
    socket.on('hydrate', () => {
      this.hydrateStateWithLocalStorage();
    })
    // Handles user exiting page or refreshing.
    window.addEventListener('beforeunload', this.finalCleanup);
  }

  // Produce layout for message boxes (updated whenever there's a change).
  getLayout(room_names, num_cols) {
    var layout = []
    for (var i = 0; i < room_names.length; i++) {
      layout.push({
        i: 'Room' + room_names[i], 
        x: (i*2)%num_cols, 
        y: 2*(Math.floor(2*i/num_cols)), 
        w: 2, 
        h: 2, 
        static: true
      });
    }
    return layout;
  }

  render() {
    let room_names = this.state.currRooms.map(room => room['name']);
    var layouts = {
      lg: this.getLayout(room_names,12),
      md: this.getLayout(room_names,8),
      sm: this.getLayout(room_names,6),
      xs: this.getLayout(room_names,4),
      xxs: this.getLayout(room_names,2),
    }
    return (
      <div>
        <Navbar color="secondary">
          <NavbarBrand style={{color:"white"}}>
            Chat Server
          </NavbarBrand>
        </Navbar>
        <Container>
          <Row style={{height: 30}}></Row>
          <NameBox username={this.state.username} 
            onUpdate={this.changeUsername} 
            onConverse={this.addRoom} socket={socket}/>
          <ResponsiveGridLayout className="layout" layouts={layouts} 
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            cols={{lg: 12, md: 8, sm: 6, xs: 4, xxs: 2}} rowHeight={200}>
            {this.state.currRooms.map((room,index) => {
              return (
                <div key={'Room' + room['name']}>
                  <MessageBox username={this.state.username} 
                    other_user={room['other_user']} history={room['history']} 
                    onAddHistory={function(msg, type, username) {
                      room['history'].push({
                        message: msg,
                        type: type,
                        username: username
                      });
                    }} onClose={this.delRoom} socket={socket} />
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </Container>
      </div>
    );
  }
}

export default App;
