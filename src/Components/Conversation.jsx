import React, { Component } from 'react';
import Header from './Header.jsx';
import Messages from './Messages.jsx';
import _ from 'lodash';

// Conversation
export default class Conversation extends Component {
		translate = (lang) => {
			switch (lang) {
				case "fr":
					return " avec ";
				case "nl":
					return " met ";
				default:
				return " with ";
			}
		}
		headerText = () => {
			let txt = "Chat";
			let pp = this.props.participants;
			if (pp && pp.length > 0) {
				txt+= this.translate(this.props.lang) + _.join(pp.map((p)=>{return p.name}), ", ");
				
			}
			return txt;
		}
				
		render() {

		return (
			<div className='Conversation'>
				<Header name={this.headerText()} />
				<div className="container">
					<Messages messages={this.props.messages} />
				</div>
			</div>
		);
	}
}
