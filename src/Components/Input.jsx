import React, { Component } from 'react';

export default class Input extends Component{
	render() {
		return (
			<form onSubmit={this.props.onSubmit} className="Input">
				<input className="messageInput" ref="message" name="message" type="text" placeholder="Enter your message..." />
				<button>
					<i className="fa fa-send"></i>
				</button>
			</form>
		);
	}
}