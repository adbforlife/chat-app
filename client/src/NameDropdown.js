import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    this.refreshList = this.refreshList.bind(this);
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

  refreshList() {
    this.setState({
      listUsers: []
    }, () => {
      this.props.socket.emit('broadcast_request');
    })
  }

  componentDidMount() {
    this.refreshList();

    this.props.socket.on('refresh', this.refreshList);
    this.props.socket.on('user_list_add', this.add);

    this.props.socket.on('user_list_del', (data) => {
      this.setState({listUsers: this.state.listUsers.filter(function(username) { 
        return username !== data;
      })});
    });
  }

  startConvo(name) {
    this.props.onConverse(name);
  }

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret disabled={this.props.dropdownDisabled}>
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

NameDropdown.propTypes = {
  username: PropTypes.string.isRequired,
  dropdownDisabled: PropTypes.bool.isRequired,
  onConverse: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired
};

export default NameDropdown;
