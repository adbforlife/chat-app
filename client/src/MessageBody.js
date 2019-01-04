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
      history: []
    };

    this.updateHistory = this.updateHistory.bind(this);
  }

  updateHistory(msg) {
    this.setState({
      history: [...this.state.history, msg]
    });
  }

  componentDidMount() {
    this.props.socket.on('message', (msg,username,other_user) => {
      console.log("got a message!");
      if ((other_user !== this.props.other_user || username !== this.props.username) && (other_user !== this.props.username || username !== this.props.other_user)) return;
      this.updateHistory(username + ": " + msg);
    });

    this.props.socket.on('enter_exit', (msg,username,other_user) => {
      console.log("got a good message!" + msg + username + other_user);
      if ((other_user !== this.props.other_user || username !== this.props.username) && (other_user !== this.props.username || username !== this.props.other_user)) return;
      this.updateHistory(msg);
    });
  }

  componentWillUnmount() {
    this.props.socket.removeAllListeners('message');
    this.props.socket.removeAllListeners('enter_exit');
  }

  render() {
    return (
      <Row>
        <Col>
          <ul>
            {this.state.history.map((item, index) =>
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
  socket: PropTypes.object.isRequired
};

export default MessageBody;
