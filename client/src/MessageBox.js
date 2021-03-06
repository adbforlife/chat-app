import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MessageNavbar from './MessageNavbar';
import MessageBody from './MessageBody';
import MessageEnterField from './MessageEnterField';
import { 
  Card, 
  CardBody,
  CardFooter,
  CardHeader } from 'reactstrap'; 

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlone: true
    };
    this.changeIsAlone = this.changeIsAlone.bind(this);
  }

  changeIsAlone(val) {
    this.setState({
      isAlone: val
    });
  }

  render() {
    return (
      <Card>
        <CardHeader>
          <MessageNavbar other_user={this.props.other_user} 
            onClose={this.props.onClose}/>
        </CardHeader>
        <CardBody>
          <MessageBody username={this.props.username} 
            other_user={this.props.other_user} history={this.props.history} 
            isAlone={this.state.isAlone} changeIsAlone={this.changeIsAlone} 
            onAddHistory={this.props.onAddHistory} socket={this.props.socket}/>
        </CardBody>
        <CardFooter>
          <MessageEnterField username={this.props.username} 
            other_user={this.props.other_user} socket={this.props.socket}/>
        </CardFooter>
      </Card>
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
