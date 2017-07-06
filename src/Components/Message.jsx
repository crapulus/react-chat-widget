import React, { Component } from 'react';
import {ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';

const style = {
	Message: {
        FontSize: 8,
    }
}

export default class Message extends Component {
	render() { 
		return (
			<Paper zDepth={2}>
			<ListItem
				style={style.Message}
				insetChildren={true}
				//disabled={true}
				rightAvatar = {(this.props.sender === 1) ? <Avatar size={30}>Me</Avatar>: null}
				leftAvatar = {(this.props.sender === 2) ? <Avatar size={30}>RT</Avatar>: null}
				primaryText={this.props.message}
				secondaryText={this.props.timeStamp.format("HH:MM") + " " + this.props.timeStamp.fromNow()  }
				/>
			</Paper>
	)}
}