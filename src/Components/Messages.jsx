import React, { Component } from 'react';
import Message from './Message.jsx';

export default class Messages extends Component{
	
	render() {
		
		let messages = this.props.messages.map(function(message, i) {
			return <Message key={i} message={message.message} sender={message.sender} timeStamp={message.timeStamp} />;
		});
		
		return (
			<div className='Messages'>
				{messages}
			</div>
		);
	}
}