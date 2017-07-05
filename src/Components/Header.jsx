import React, { Component } from 'react';

export default class Header extends Component{
	render() {
		return (
			<header>
				<div className="name"><span>{this.props.name}</span>					
					</div>	
			</header>
		)
	}
}