import React, { Component } from 'react';
import {ListItem} from 'material-ui/List';

const style= {
	Message: {
        FontSize: "xSmall"
    }
}

export default class Message extends Component {
	render() { 
		return (
		<ListItem
			style={style.Message}
			primaryText={this.props.message}
		    secondaryText={this.props.timeStamp.format("HH:MM") + " " + this.props.timeStamp.fromNow()  }
			/>
	)}
}