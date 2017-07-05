import React, { Component } from 'react';

export default class Message extends Component{
	render() {
		if(this.props.sender === 1) {
			this.classNames = "Message Message--you";
		} else {
			this.classNames = "Message Message--them"; 
		}
		return (
			<div className={this.classNames}>				
				<span>
					<label className="TimeStamp">
						{this.props.timeStamp.format("HH:MM:ss") +  " - " + this.props.timeStamp.fromNow()}
					</label>
					{this.props.message}
					</span>	
			</div>
		);
	}
}