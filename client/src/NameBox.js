import React, { Component } from 'react';

function ListItem(props) {
  return <option>{props.value}</option>;
}

class NameBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      listUsers: ['']
    };

    this.add = this.add.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  add(data) {
    this.setState({
      listUsers: [...new Set([...this.state.listUsers, data].sort())]
    });
  }

  componentDidMount() {
    this.props.socket.emit('broadcast_request');

    this.props.socket.on('init', this.add);
    setTimeout(function () {
      this.props.socket.removeListener('init', this.add);
    }.bind(this), 3000);

    this.props.socket.on('user_list_add', this.add);

    this.props.socket.on('user_list_del', (data) => {
      this.setState({listUsers: this.state.listUsers.filter(function(username) { 
        return username !== data;
      })});
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.onEnter();
    }
  }

  handleEnter(event) {
    this.onEnter();
  }

  onEnter() {
    this.props.onUpdate(this.state.value);
    this.setState({value: ''});
  }

  render() {
    return (
      <div>
        <label>Your name: </label>
        <input type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
        <button onClick={this.handleEnter}>Enter</button>
        <label> Start a conversation: </label>
        <select>
          {this.state.listUsers.map((item, index) => 
            <ListItem key={index} value={item}/>
          )}
        </select>
      </div>
    );
  }
}

export default NameBox;
