import {observable, computed, action, useStrict} from "mobx";
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/nl';
import ChatClient from './../Services/ChatAxiosClient';
import { startParametersModel } from '../Services/ChatCommonResponseModels';

useStrict();

const debugMode = false; //verbose store output not for prod!!!
const storeSessionStorageKey = "nrcwv1_cfg"; // const linked to the widget script as deployed / see public/index.html
const chatClient = new ChatClient({mock: true}); //set mocked api for debug

class ChatStore {

		@observable pollWait = 2000; //default 3s;
		@observable messages = [];
		@observable participants = [];
		@observable language = "en";
		@observable pollingActive = false;
		@observable participantId = "";
		 chatId = "";
		 participantUserName = "none";
		 pollingid = -1;
		 headerText = "Chat";

	 	connect = () => {	
			let p = JSON.parse(sessionStorage.getItem(storeSessionStorageKey));
			if (debugMode) console.log("store connecting with config =", storeSessionStorageKey, sessionStorage.getItem(storeSessionStorageKey));	
			//got params object
			if (!!p) {
				if (debugMode) console.log("global widget params found:" , p);
				let params = startParametersModel; 
        		params.CustomerIdentifier = p.customeridentifier;
				
				//override language
				if (debugMode) console.log(`Widget Language:${p.language} - Browser Language:${navigator.language}`);
				this.language = !!p.language ? p.language : (navigator.language || navigator.userAgent.language);
				if (debugMode) console.log(`Setting language to ${this.language}`); 
        		params.WebSiteInfo.Language = p.language;
		
				//create title text param
				this.headerText = (p.title || this.headerText) + " (" + this.language.toUpperCase() + ")";
				
				//override participant username if any
				this.participantUserName = !!p.username ? p.username : this.participantUserName;
				params.Participant.LastName = this.participantUserName;
				params.Participant.Firstname = this.participantUserName;
				if (debugMode) console.log("connecting store to chatapi...", params);
				chatClient.start(params)
					.then(this.connectOk);
			}
		}

		@action connectOk = (connectResponse) => {
			if (!!connectResponse && !!connectResponse.data && connectResponse.data.chat.status.type==="success") {
				let chat = connectResponse.data.chat;
				if (debugMode) console.log("started chat: ", chat.status.type);
				if (debugMode) console.log("updating chat properties: ", chat.status.type);
				//this.messages.length = 0;
				this.chatId = chat.chatID;
				this.participantId = chat.participantID;
				this.pollWait = chat.pollWaitSuggestion;	
				this.parseResponse("start", chat);				
			} else {
				if (debugMode) console.warn("start chat failed: ", connectResponse.data || connectResponse);
				//what to do if failed start?		
			}
		}

		@action startPolling = () => {
			if (this.pollingid!==-1) return;	
			if (debugMode) console.log("start polling:",this.pollWait, this.pollingid);
			this.pollingActive = true;
			this.pollingid = window.setInterval(this.poll, this.pollWait);	
		}

		@action stopPolling = () => {	
			if (debugMode) console.log("stopped polling");
			this.pollingActive = false;
			window.clearInterval(this.pollingid);
			this.pollingid = -1;
		}

		poll = () => {
			if (debugMode) console.log("store polling check: active, pid, pollingId, messages", this.pollingActive, this.participantId, this.pollingid, this.messagesCount);
			if (!this.pollingActive || !this.participantId) return;
			if (debugMode) console.log(`polling ${this.participantId}...`);
			chatClient.poll(this.participantId)
				.then((response) => { 
					let chat = response.data.chat;
					if (debugMode) console.log("poll response:", chat);
					this.parseResponse("poll", chat);
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

        @action updateParticipants = (event) => {
             if (event.type==="participantState" || event.participantType==="System" ) return;

             let newp = { key:event.participantID, name: event.displayName || "", type: event.participantType || "None", typing: event.state==="active" || false };
             let found = _.find(this.participants, (p) => {return p.key===newp.key} );
             if (found) {
                if (debugMode) console.log("participant found", found);
                //this.participants = _.remove(this.participants, (p) => {return p.key===found.key});
             }  else {
                this.participants = _.concat(this.participants, newp);
             }            
        }

		@action parseEvents = (events) => {
				if (debugMode) console.log(`parsing ${events.length} event(s)`, events);
				//this.events = _.concat(this.events, events);
				_.map(_.orderBy(events,e => {return e.sequenceNumber}), (event) => {
					if (event.displayName && event.participantType)	this.updateParticipants(event);   
					//todo complete	& improve			
						switch (event.type) {
							case "text":
								if (event.value) 
								{
									let sender = (event.participantType==="WebUser") ? 1 : 2;
									let timeStamp = new moment(); timeStamp.locale(this.language);
									this.messages = this.messages.concat([{
										key:event.sequenceNumber, 
										sender:sender, 
										displayName:event.displayName, 
										message:event.value, 
										timeStamp: timeStamp
									}]);
								}                            
								break;
							case "participantStateChanged":
								if (debugMode) console.log("participant state:",event);
								break;
							case "typingIndicator":
								if (debugMode) console.log("typing:",event);
								break;
							default:
								break;
						}
    		});       
		}
		
		@action sendMessage(message) {
			message.timeStamp = new moment(); 
			message.timeStamp.locale(this.language);
			chatClient.send(this.particpantId, message.message)
			.then((response) => { 
					if (debugMode) console.log("received send reponse:", response);
					if (!!response.data && !!response.data.chat) this.parseResponse("send", response.data.chat)
					});
		}

		@action disconnect() {	
			if (debugMode) console.log("disconnecting:", this.pollingid, this.participantId);
			if (this.pollingid) window.clearInterval(this.pollingid);			
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