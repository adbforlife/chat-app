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
      listItems: []
    };
  }

  componentDidMount() {
    this.props.socket.on('message', (msg,username,other_user) => {
      console.log("got a message!")
      if ((other_user !== this.props.other_user || username !== this.props.username) && (other_user !== this.props.username || username !== this.props.other_user)) return;
      this.setState({
        listItems: [...this.state.listItems, username + ": " + msg]
      });
    });
  }

  render() {
    return (
      <Row>
        <Col>
          <ul>
            {this.state.listItems.map((item, index) =>
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