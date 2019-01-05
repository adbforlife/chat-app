import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MessageNavbar from './MessageNavbar';
import MessageBody from './MessageBody';
import MessageEnterField from './MessageEnterField';
import { Container, Row } from 'reactstrap'; 

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlone: true
    };
    this.changeIsAlone = this.changeIsAlone.bind(this);
  }

  /*componentDidMount() {
    setInterval(function() {
      console.log(this.state.isAlone);
    }.bind(this), 1000);
  }*/

  changeIsAlone(val) {
    this.setState({
      isAlone: val
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <MessageNavbar other_user={this.props.other_user} onClose={this.props.onClose}/>
        </Row>
        <MessageBody username={this.props.username} other_user={this.props.other_user} history={this.props.history} isAlone={this.state.isAlone} changeIsAlone={this.changeIsAlone} onAddHistory={this.props.onAddHistory} socket={this.props.socket} />
        <Row>
          <MessageEnterField username={this.props.username} other_user={this.props.other_user} socket={this.props.socket}/>
        </Row>
      </Container>
    );
  }
}

MessageBox.propTypes = {
  username: PropTypes.string.isRequired,
  other_user: PropTypes.string.isRequired,
  history: PropTypes.array.isRequired,
  onAddHistory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired
};

export default MessageBox;
