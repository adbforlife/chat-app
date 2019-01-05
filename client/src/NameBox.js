import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NameEnterField from './NameEnterField';
import NameDropdown from './NameDropdown';

class NameBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownDisabled: true
    };

    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(val) {
    if (!val) return;
    this.props.onUpdate(val);
    this.setState({
      dropdownDisabled: false
    });
  }

  render() {
    return (
      <div>
        <NameEnterField username={this.props.username} onUpdate={this.onUpdate}/>
        <NameDropdown username={this.props.username} dropdownDisabled={this.state.dropdownDisabled} onConverse={this.props.onConverse} socket={this.props.socket}/>
      </div>
    );
  }
}

NameBox.propTypes = {
  username: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onConverse: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired
}

export default NameBox;
