import React, { Component } from 'react';
import MessageEnterField from './MessageEnterField';

class MessageBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MessageEnterField socket={this.props.socket}/>
    );
  }
}


export default MessageBox;
