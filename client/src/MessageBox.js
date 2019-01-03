import React, { Component } from 'react';
import MessageEnterField from './MessageEnterField';
import { Button, Container, Row, Col } from 'reactstrap'; 


function ListItem(props) {
  return <li>{props.value}</li>;
}

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      listItems: []
    };
  }

  componentDidMount() {
    this.props.socket.on('message', (msg) => {
      //this.state.listItems.push(<li key={this.state.number+1}>{msg}</li>);
      this.setState({
        number: this.state.number+1,
        listItems: [...this.state.listItems, msg]
      });
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Button close />
        </Row>
        <Row>
          <Col>
            <ul>
              {this.state.listItems.map((item, index) =>
                <ListItem key={index} value={item}/>
              )}
            </ul>
          </Col>
        </Row>
        <Row>
          <MessageEnterField socket={this.props.socket}/>
        </Row>
      </Container>
    );
  }
}


export default MessageBox;
