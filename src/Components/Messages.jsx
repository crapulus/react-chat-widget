import React, { Component } from 'react';
import Message from './Message.jsx';
import {List} from 'material-ui/List';
import style from './Messages.style.js';

export default class Messages extends Component{

	render() {
		
		let messages = this.props.messages.map(function(message, i) {
			return <Message key={i} message={message.message} sender={message.sender} timeStamp={message.timeStamp} />;
		});
		
		return (
			<List id="messageslist" style={style.MessageList}>
				{messages}
			</List>
		);
	}
}