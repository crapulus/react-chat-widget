import React, { Component } from 'react';
import {ListItem} from 'material-ui/List';

export default class Message extends Component {
	render() { 
		return (
		<ListItem
			primaryText={this.props.message}
		    secondaryText={this.props.timeStamp.format("HH:MM") + " " + this.props.timeStamp.fromNow()  }
			/>
	)}
}