import React, { Component } from 'react';
import PropTypes from 'prop-types';

function ListItem(props) {
  if (props.type === 'enter_exit') {
    return <li className={'message-enter-exit'}>{props.value}</li>;
  } else {
    return (
      <li className={'message-' + props.type}>
        <div className="message-content">
          <div className="message-username">
            {props.username}
          </div>
          <div className='message-text'>{props.value}</div>
        </div>
      </li>
    )
  }
}

class MessageBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.history
    };

    this.checkMessageOrigin = this.checkMessageOrigin.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
  }

  // Verify that the message belongs to the specific box.
  checkMessageOrigin(username, other_user) {
    return (other_user === this.props.other_user 
      && username === this.props.username) 
      || (other_user === this.props.username 
      && username === this.props.other_user);
  }

  // General update on receiving any message.
  updateMessages(msg, username, other_user, type) {
    if (type === 'enter_exit') {
      username = '';
    }
    this.setState({
      messages: [...this.state.messages, {
        message: msg,
        type: type,
        username: username
      }]
    });
  }

  // Handles receiving a message from a user.
  onMessage = (msg,username,other_user) => {
    if (!this.checkMessageOrigin(username, other_user)) return;
    // Give the message a type depending on origin.
    let type = username===this.props.username ? 'self' : 'others'
    this.updateMessages(msg, username, other_user, type);
    if (!this.props.isAlone) {
      // Update the history of messages.
      this.props.onAddHistory(msg, type, username);
    }
  }

  // Handles receiving a message indicating user enter.
  onEnter = (msg,username,other_user) => {
    if (!this.checkMessageOrigin(username, other_user)) return;
    this.updateMessages(msg, username, other_user, 'enter_exit');
    this.props.socket.emit('request', JSON.stringify({
      username: this.props.username,
      other_user: this.props.other_user
    }));
  }

  // Handles receiving a message indicating user exit.
  onExit = (msg,username,other_user) => {
    if (!this.checkMessageOrigin(username, other_user)) return;
    this.updateMessages(msg, username, other_user, 'enter_exit');
    if (username !== this.props.username) {
      this.props.changeIsAlone(true);
    }
  }

  // Handles server requesting information.
  onRequestInfo = () => {
    this.props.socket.emit('give_user', JSON.stringify({
      username: this.props.username,
      other_user: this.props.other_user
    }))
  }

  // Handles receiving information from server.
  onReceiveUser = (username) => {
    if (username !== this.props.username) {
      this.props.changeIsAlone(false);
    }
  }

  // Auto scrolling implementation.
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.props.socket.on('message', this.onMessage);
    this.props.socket.on('enter', this.onEnter);
    this.props.socket.on('exit', this.onExit);
    this.props.socket.on('request_info', this.onRequestInfo);
    this.props.socket.on('receive_user', this.onReceiveUser);
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.props.socket.removeListener('message', this.onMessage);
    this.props.socket.removeListener('enter', this.onEnter);
    this.props.socket.removeListener('exit', this.onExit);
    this.props.socket.removeListener('request_info', this.onRequestInfo);
    this.props.socket.removeListener('receive_user', this.onReceiveUser);
  }

  render() {
    return (
      <div className="message-body">
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {this.state.messages.map((item, index) =>
            <ListItem key={index} value={item['message']} type={item['type']} 
              username={item['username']}/>
          )}
        </ul>
        <div style={{ float:"left", clear: "both" }}
          ref={(el) => { this.messagesEnd = el; }}>
        </div>
      </div>
    );
  }
}

MessageBody.propTypes = {
  username: PropTypes.string.isRequired,
  other_user: PropTypes.string.isRequired,
  history: PropTypes.array.isRequired,
  changeIsAlone: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired
};

export default MessageBody;
