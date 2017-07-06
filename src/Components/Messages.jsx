import React, { Component } from 'react';
import Message from './Message.jsx';
import {List} from 'material-ui/List';

export default class Messages extends Component{
	
	render() {
		
		let messages = this.props.messages.map(function(message, i) {
			return <Message key={i} message={message.message} sender={message.sender} timeStamp={message.timeStamp} />;
		});
		
		return (
			<List style={this.props.style}>
				{messages}
			</List>
		);
	}
}