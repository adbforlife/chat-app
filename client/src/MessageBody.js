import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap'; 

function ListItem(props) {
  return <li className="message-other">{props.value}</li>;
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

  checkMessageOrigin(username, other_user) {
    return (other_user === this.props.other_user && username === this.props.username) || (other_user === this.props.username && username === this.props.other_user)
  }

  updateMessages(msg, username, other_user) {
    console.log("got a good message!" + msg + username + other_user);
    if (!this.checkMessageOrigin(username, other_user)) return;
    this.setState({
      messages: [...this.state.messages, msg]
    });
  }

  onMessage = (msg,username,other_user) => {
    let string = username + ": " + msg;
    this.updateMessages(string, username, other_user);
    if (!this.props.isAlone) {
      if (!this.checkMessageOrigin(username, other_user)) return;
      console.log("im not alone");
      this.props.onAddHistory(string);
    }
  }

  onEnter = (msg,username,other_user) => {
    this.updateMessages(msg, username, other_user);
    this.props.socket.emit('request', JSON.stringify({
      username: this.props.username,
      other_user: this.props.other_user
    }));
  }

  onExit = (msg,username,other_user) => {
    this.updateMessages(msg, username, other_user);
    if (username !== this.props.username) {
      this.props.changeIsAlone(true);
    }
  }

  onRequestInfo = () => {
    this.props.socket.emit('give_user', JSON.stringify({
      username: this.props.username,
      other_user: this.props.other_user
    }))
  }

  onReceiveUser = (username) => {
    if (username !== this.props.username) {
      this.props.changeIsAlone(false);
    }
  }

  renderMessage = (msg) => {

  }

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
        {/*<Row>
          <ListGroup>
            {this.state.messages.map((item, index) => {
              return <ListGroupItem key={index}>{item}</ListGroupItem>
            })}
          </ListGroup>
          
          
        </Row>*/}
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {this.state.messages.map((item, index) =>
            <ListItem key={index} value={item}/>
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
