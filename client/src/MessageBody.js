import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap'; 

function ListItem(props) {
  return <li>{props.value}</li>;
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

  componentDidMount() {
    this.props.socket.on('message', (msg,username,other_user) => {
      let string = username + ": " + msg;
      this.updateMessages(string, username, other_user);
      if (!this.props.isAlone) {
        if (!this.checkMessageOrigin(username, other_user)) return;
        console.log("im not alone");
        this.props.onAddHistory(string);
      }
    });

    this.props.socket.on('enter', (msg,username,other_user) => {
      this.updateMessages(msg, username, other_user);
      this.props.socket.emit('request', JSON.stringify({
        username: this.props.username,
        other_user: this.props.other_user
      }));
    });

    this.props.socket.on('exit', (msg,username,other_user) => {
      this.updateMessages(msg, username, other_user);
      if (username !== this.props.username) {
        this.props.changeIsAlone(true);
      }
    });

    this.props.socket.on('request_info', () => {
      this.props.socket.emit('give_user', JSON.stringify({
        username: this.props.username,
        other_user: this.props.other_user
      }))
    })

    this.props.socket.on('receive_user', (username) => {
      if (username !== this.props.username) {
        this.props.changeIsAlone(false);
      }
    });
  }

  componentWillUnmount() {
    this.props.socket.removeAllListeners('message');
    this.props.socket.removeAllListeners('enter');
    this.props.socket.removeAllListeners('exit');
    this.props.socket.removeAllListeners('request_info');
    this.props.socket.removeAllListeners('receive_user');
  }

  render() {
    return (
      <Row>
        <Col>
          <ul>
            {this.state.messages.map((item, index) =>
              <ListItem key={index} value={item}/>
            )}
          </ul>
        </Col>
      </Row>
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
