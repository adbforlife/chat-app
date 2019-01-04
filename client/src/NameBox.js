import React, { Component } from 'react';
import NameEnterField from './NameEnterField';
import NameDropdown from './NameDropdown';

class NameBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      dropdownDisabled: true
    };

    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(val) {
    if (!val) return;
    this.props.onUpdate(val);
    this.setState({
      username: val,
      dropdownDisabled: false
    });
  }

  render() {
    return (
      <div>
        <NameEnterField onUpdate={this.onUpdate}/>
        <NameDropdown username={this.state.username} dropdownDisabled={this.state.dropdownDisabled} onConverse={this.props.onConverse} socket={this.props.socket}/>
      </div>
    );
  }
}

export default NameBox;
