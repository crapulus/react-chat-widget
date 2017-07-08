import React, { Component } from 'react';
import { observer } from 'mobx-react';
import CardText from 'material-ui/Card';
import { GridList } from 'material-ui/GridList';

import Message from './Message.jsx';

@observer
export default class Conversation extends Component {		
	renderMessage = (message, idx) => {
		return (
			<Message
				key={idx}
				message={message.message}
				sender={message.sender}
				displayName={message.displayName}
				timeStamp={message.timeStamp}
				style={this.props.style.Message}
			/>);
	}	

	render() {
		let messages = this.props.messages.map(this.renderMessage);					
		return (		
			<CardText>
				<GridList
					style={this.props.style.MessageList}
					cols={1}
					cellHeight="auto"
					padding={8}
					id="messageslist">
					{messages}
				</GridList>
			</CardText>
		);
	}
}
