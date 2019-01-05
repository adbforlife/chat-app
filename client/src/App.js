import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
import MessageBox from './MessageBox';
import NameBox from './NameBox';
import { Container, Row, Col } from 'reactstrap';
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
    this.hydrateStateWithLocalStorage = this.hydrateStateWithLocalStorage.bind(this);
    this.saveRoomsToLocalStorage = this.saveRoomsToLocalStorage.bind(this);
    this.getRoomName = this.getRoomName.bind(this);
    this.finalCleanup = this.finalCleanup.bind(this);
  }

  finalCleanup() {
    socket.emit('broadcast_del', this.state.username);
    window.removeEventListener('beforeunload', this.finalCleanup);
  }

  storeRoom(username,other_user,room_name,history) {
    for (var i = 0; i < this.state.storedRooms.length; i++) {
      if (this.state.storedRooms[i]['room_name'] === room_name) {
        let room = this.state.storedRooms[i];
        room['history'] = history;
        console.log(this.state.storedRooms);
        this.saveRoomsToLocalStorage();
        return;
      }
    }
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
    //this.saveRoomsToLocalStorage();
    setTimeout(function() {
      console.log(this.state.storedRooms);
    }.bind(this), 1000);
  }

  hydrateStateWithLocalStorage() {
    let key = 'storedRooms'
    if (localStorage.hasOwnProperty(key)) {
      let value = localStorage.getItem(key);
      try {
        value = JSON.parse(value);
        this.setState({ storedRooms: value });
      } catch (e) {
        // handle empty string
        this.setState({ storedRooms: value });
      }
    }
  }

  saveRoomsToLocalStorage() {
    localStorage.setItem('storedRooms', JSON.stringify(this.state.storedRooms));
  }

  changeUsername = (name) => {
    if (this.state.username) {
      return;
      //socket.emit('broadcast_del', this.state.username);
    }
    this.setState({
      username: name
    }, () => {
      socket.emit('broadcast_add', name);
    });
  }

  getRoomName(username, other_user) {
    return [this.state.username, other_user].join('');
  }

  addRoom = (other_user) => {
    for (var i = 0; i < this.state.currRooms.length; i++) {
      if (this.state.currRooms[i]['other_user'] === other_user)
        return false;
    }
    let room_name = this.getRoomName(this.state.username, other_user);
    var history = []
    for (var j = 0; j < this.state.storedRooms.length; j++) {
      if (this.state.storedRooms[j]['room_name'] === room_name && this.state.storedRooms[j]['username'] === this.state.username) {
        history = this.state.storedRooms[j]['history'];
        break;
      }
    }
    this.setState({
      currRooms: [...this.state.currRooms, {
        username: this.state.username,
        name: room_name,
        other_user: other_user,
        history: history
      }]
    });
    socket.emit('join', JSON.stringify({
      username: this.state.username,
      other_user: other_user
    }));
  }

  delRoom = (other_user) => {
    let room_name = this.getRoomName(this.state.username, other_user);
    var history = [];
    console.log("closing" + room_name)
    this.setState({currRooms: this.state.currRooms.filter(function(room) { 
        let same_name = (room['name'] === room_name);
        if (same_name) {
          history = room['history'];
        }
        return !same_name;
    })});
    console.log(history);
    let room = {
      username: this.state.username,
      other_user: other_user,
    }
    socket.emit('leave', JSON.stringify(room));
    this.storeRoom(this.state.username, other_user, room_name, history);
  }

  componentDidMount() {
    document.body.style = 'background: #f0f0f0;';
    this.hydrateStateWithLocalStorage();
    socket.on('username_request', () => {
      if (this.state.username) {
        socket.emit('broadcast_add', this.state.username);
      }
    });
    socket.on('hydrate', () => {
      this.hydrateStateWithLocalStorage();
    })
    window.addEventListener('beforeunload', this.finalCleanup);
  }

  getLayout(num_rooms, num_cols) {
    var layout = [
    {i: 'NameBox', x: 0, y: 0, w: 12, h: 1, static: true}
    ]
    for (var i = 0; i < num_rooms; i++) {
      layout.push(
        {i: 'Room' + i.toString(), x: (i*2)%num_cols, y: 2*(Math.floor(2*i/num_cols)), w: 2, h: 2, static: true}
      );
    }
    return layout;
  }

  render() {
    let num_rooms = this.state.currRooms.length;
    var layouts = {
      lg: this.getLayout(num_rooms,12),
      md: this.getLayout(num_rooms,8),
      sm: this.getLayout(num_rooms,6),
      xs: this.getLayout(num_rooms,4),
      xxs: this.getLayout(num_rooms,2),
    }
    console.log(layouts)
    return (
      <Container>
        <Row style={{height: 35}}></Row>
        <NameBox username={this.state.username} onUpdate={this.changeUsername} onConverse={this.addRoom} socket={socket}/>
        <ResponsiveGridLayout className="layout" layouts={layouts} 
          breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
          cols={{lg: 12, md: 8, sm: 6, xs: 4, xxs: 2}} rowHeight={200}>
          {this.state.currRooms.map((room,index) => {
            return (
              <div key={'Room' + index}>
                <MessageBox username={this.state.username} other_user={room['other_user']} history={room['history']} onAddHistory={function(msg, type, username) {
                  room['history'].push({
                    message: msg,
                    type: type,
                    username: username
                  });
                  console.log(room['history']);
                  console.log("adding to history " + msg);
                }} onClose={this.delRoom} socket={socket} />
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </Container>
    );
  }
}

export default App;
