import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {MuiThemeProvider, getMuiTheme} from 'material-ui/styles';
import {FloatingActionButton} from 'material-ui';
import Chat from './Chat.jsx';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import CloseIcon from 'material-ui/svg-icons/navigation/expand-more';

import style from './Widget.style.js';
import Translations from './Chat.Translations.json';

const muiTheme = getMuiTheme(style.Theme);

@inject("chatStore")
@observer
class Widget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    toggle = () => {
        if (!this.state.open) this.props.chatStore.startPolling();
        this.setState((prevState) => {
            return {
                open: !prevState.open
            }
        });
    }

    handleExpandChange = () => {
        //do something
    }

    getStyle = () => {
        let s = style;
        s.Chat.display = this.state.open
            ? "inline"
            : "none";
        return s;
    }
    
    getTranslations = () => {
         return Translations;
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <FloatingActionButton
                        style={style.FloatingButton}
                        onTouchTap={this.toggle}
                        zDepth={2}>
                        {this.state.open ? <CloseIcon/> : <ChatIcon/>}
                    </FloatingActionButton>
                    <Chat open={this.state.open} translations={this.getTranslations()} chatStore={this.props.chatStore} style={this.getStyle()}/>                    
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Widget