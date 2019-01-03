import React, { Component } from 'react';
import NameEnterField from './NameEnterField';
import NameDropdown from './NameDropdown';

class NameBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };

    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(val) {
    this.props.onUpdate(val);
    this.setState({
      username: val
    });
  }

  render() {
    return (
      <div>
        <NameEnterField onUpdate={this.onUpdate}/>
        <NameDropdown username={this.state.username} socket={this.props.socket}/>
      </div>
    );
  }
}

export default NameBox;
