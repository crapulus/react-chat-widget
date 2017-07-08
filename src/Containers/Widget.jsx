import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {MuiThemeProvider, getMuiTheme} from 'material-ui/styles';
import {FloatingActionButton} from 'material-ui';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import CloseIcon from 'material-ui/svg-icons/navigation/expand-more';
import Chat from './Chat.jsx';

import style from './Widget.style.js';
import T from './Chat.Translations.json';

@inject("chatStore")
@observer
class Widget extends Component {
    constructor(props, context) {
        super(props);
        this.muiTheme = getMuiTheme(style.Themes[this.props.chatStore.getThemeName()]);
        this.state = {
            open: false
        };
    }
        
    toggle = () => {
        //if (!this.state.open) this.props.chatStore.startPolling();
        this.setState((prevState) => {
            return {
                open: !prevState.open
            }
        });
    }

    getStyle = () => {
        let s = style;
        s.Chat.display = this.state.open
            ? "inline"
            : "none";
        return s;
    }

	componentWillUnmount = () => {
		//console.log("widget willunmount: props, state", this.props,this.state);
		this.props.chatStore.disconnect();
	}

    i18n = (ref, plural) => {
    if (plural) {
        if (plural > 1) return T[this.props.chatStore.language || "en"][ref][1] || `${ref} not found`; 
            else return T[this.props.chatStore.language || "en"][ref][0] || `${ref} not found`
        } 
            else return T[this.props.chatStore.language || "en"][ref] || `${ref} not found`;
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={this.muiTheme}>
                <div>
                    <Chat 
                        open={this.state.open} 
                        chatStore={this.props.chatStore} 
                        i18n={this.i18n}
                        style={this.getStyle()}
                        muiTheme={this.muiTheme}
                        />                    
                    <FloatingActionButton
                        style={style.FloatingButton}
                        onTouchTap={this.toggle}
                        zDepth={2}>
                        {this.state.open ? <CloseIcon/> : <ChatIcon/>}
                    </FloatingActionButton>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Widget