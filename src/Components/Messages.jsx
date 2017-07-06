import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Message from './Message.jsx';
import {GridList} from 'material-ui/GridList';
import style from './Messages.style.js';

@observer
export default class Messages extends Component{

	render() {
		
		let messages = this.props.messages.map(function(message, i) {
			return <Message key={i} message={message.message} sender={message.sender} timeStamp={message.timeStamp} />;
		});
		
		return (
			<GridList 
				style={style.MessageList}
				cols={1}
				cellHeight="auto"
				padding={8}
				id="messageslist" >
				{messages}
			</GridList>
		);
	}
}