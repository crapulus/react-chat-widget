import {observable, computed, action, useStrict} from "mobx";
import ChatClient from './ChatAxiosClient';
import _ from 'lodash';
import moment from 'moment';

useStrict();

const debugMode = true;
const chatClient = new ChatClient();

class ChatStore {

		@observable chatId = "";
		@observable participantId = "";
		@observable participantUserName = "Anonymous";
		@observable pollWait = 2000; //default 3s;
		@observable messages = [];
		@observable participants = [];
		@observable pollingActive = false;
		@observable pollingid = -1;

	 	connect = (params) => {	
			console.log("store connecting with config =", params);	
			let p = JSON.parse(sessionStorage.getItem(params.CustomerIdentifier));
			if (debugMode) console.log("global widget params found:" , p);
			if (!!p) {
				//override language
				params.WebSiteInfo.Language = !!p.language ? p.language : params.WebSiteInfo.Language;
				//create title text param
				params.HeaderText = p.title || "Chat";
				//override participant username if any
				this.participantUserName = !!p.username ? p.username : this.participantUserName;
			}
			if (debugMode) console.log("connecting store to chatapi...");
			chatClient.start(params)
				.then(this.connectOk);
		}

		@action connectOk = (connectResponse) => {
			if (!!connectResponse && !!connectResponse.data && connectResponse.data.chat.status.type==="success") {
				let chat = connectResponse.data.chat;
				if (debugMode) console.log("started chat: ", chat.status.type);
				if (debugMode) console.log("updating chat properties: ", chat.status.type);
				this.messages.length = 0;
				this.chatId = chat.chatID;
				this.particpantId = chat.participantID;
				this.pollWait = chat.pollWaitSuggestion;
				this.parseResponse("start", chat);
				this.startPolling();
			} else {
				console.warn("start chat failed: ", connectResponse.data || connectResponse);
				//what to do if failed start?		
			}
		}

		@action startPolling = () => {	
			if (this.pollingid === -1) {
				if (debugMode) console.log("start polling:",this.pollWait, this.tick);
				this.pollingActive = true;
				this.pollingid = setInterval(this.poll, this.pollWait);	
			}
		}

		@action stopPolling = () => {	
			if (debugMode) console.log("stopped polling");
			this.pollingActive = false;
			clearInterval(this.pollingid);
		}

		@action poll = () => {
			if (debugMode) console.log("store polling check active, tick, messages", this.pollingActive, this.tick, this.messagesCount);
			if (!this.pollingActive || !this.participantId) return;
			if (debugMode) console.log(`polling ${this.participantId}...`);
			chatClient.poll(this.participantId)
				.then((response) => { 
					if (!!response && !!response.data) this.parseResponse("poll", response.data.chat)
					}
				);
		}

		parseResponse = (action, chat) => {
			if (chat.events && chat.events.length > 0) {
				if (debugMode) console.log(`parsing "${action}" response: ${chat.events.length} events `);
				if (debugMode) console.table(chat.events);
				this.parseEvents(chat.events);
			}
		}

        updateParticipants = (event) => {
             if (event.type==="participantState" || event.participantType==="System" ) return;

             let newp = { key:event.participantID, name: event.displayName || "", type: event.participantType || "None", typing: event.state==="active" || false };
             let found = _.find(this.participants, (p) => {return p.key===newp.key} );
             if (found) {
                //console.log("participant found", found);
                //this.participants = _.remove(this.participants, (p) => {return p.key===found.key});
             }  else {
                this.participants = _.concat(this.participants, newp);
             }            
        }

		@action parseEvents = (events) => {
				console.log(`parsing ${events.length} events`);
				//this.events = _.concat(this.events, events);
				_.map(events, (event) => {
					if (event.displayName && event.participantType)	
                    this.updateParticipants(event);   
                     
					//todo complete	& improve			
						switch (event.type) {
							case "text":
								if (event.value) 
								{
									let sender = (event.participantType==="WebUser") ? 1 : 2;
									this.messages = this.messages.concat([{key:event.sequenceNumber, sender:sender, displayName:event.displayName, message:event.value, timeStamp: new moment()}]);
								}                            
								break;
							case "participantStateChanged":
								console.log("participant state:",event);
								break;
							case "typingIndicator":
								console.log("typing:",event);
								break;
							default:
								break;
						}
    		});       
		}
		
		@action sendMessage(message) {
			message.timeStamp = new moment();
			chatClient.send(this.particpantId, message.message)
			.then((response) => { 
					if (!!response && !!response.data) this.parseResponse("send", response.data.chat)
					});
		}

		@action disconnect() {	
			if (this.tick) clearInterval(this.tick);			
			chatClient.disconnect(this.participantId)
			.then((response) => this.parseResponse("exit", response.data.chat));
		}

		@computed get messagesCount() {
			return this.messages.length;
		}

		@computed get connected() {
			return  !!(this.chatId  && this.participantId )
		}

		@computed get participantsList() {
    		return this.participants.map((p) => {return p.name});
		}
}

export default ChatStore