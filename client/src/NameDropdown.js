import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function ListItem(props) {
  return <DropdownItem onClick={(e) => props.func(props.value, e)}>{props.value}</DropdownItem>;
}

class NameDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsers: [],
      dropdownOpen: false
    };

    this.add = this.add.bind(this);
    this.toggle = this.toggle.bind(this);
    this.startConvo = this.startConvo.bind(this);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  add(data) {
    if (data === this.props.username) {
      return;
    }
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

  startConvo(name) {
    console.log("starting convo with " + name);
  }

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Start a conversation:
        </DropdownToggle>
        <DropdownMenu right>
          {this.state.listUsers.map((item, index) => 
            <ListItem key={index} value={item} func={this.startConvo}/>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default NameDropdown;
