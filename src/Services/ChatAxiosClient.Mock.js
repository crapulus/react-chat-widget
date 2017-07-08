import MockAdapter from 'axios-mock-adapter';
import {commonResponse} from './ChatCommonResponseModels';
import sampleEvents from './ChatAxiosClient.Mock.SampleEvents.json';
import config from './ChatAxiosClient.Config';

const debugMode = config.debugMode;

// MOCK REST API //
export default class Mock {
    constructor(axiosInstance) {
        this.sequenceNumber = 0;
        this.mockAdapter = new MockAdapter(axiosInstance, {delayResponse: 200});
        this
            .mockAdapter
            .onPost(/chat\/start/)
            .reply(this.startFake);
        this
            .mockAdapter
            .onGet(/chat\/poll/)
            .reply(this.pollFake);
        this
            .mockAdapter
            .onPost(/chat\/sendMessage/)
            .reply(this.sendFake);
        this
            .mockAdapter
            .onPost(/chat\/disconnect/)
            .reply(200, commonResponse);
        this
            .mockAdapter
            .onPost(/chat\/setTypingState/)
            .reply(200, commonResponse);
        this
            .mockAdapter
            .onPost(/chat\/reconnect/)
            .reply(200, commonResponse);
    }

    //events sequence generator
    getNextSeq = () => {
        return++ this.sequenceNumber;
    }
    getRandomEvents = (max) => {
        let randomEvents = [];
        for (let i = 0; i < max; i++) {
            let randomEventChoice = parseInt(Math.random() * max * 10, 0);
            if (randomEventChoice < max) {
                let sampleEvent = sampleEvents[randomEventChoice];
                //add seqnr
                sampleEvent.sequenceNumber = this.getNextSeq();
                randomEvents.push(sampleEvent);
            }
        }
        return randomEvents;
    }

    //start
    startFake = (config) => {
        const startParams = JSON.parse(config.data);
        if (debugMode) console.warn("**** mocking start ****", startParams, startParams.WebSiteInfo.Language);
        let texts = {
            fr: "Bienvenue!",
            nl: "Welkom!",
            de: "Wilkommen!",
            en: "Welcome!",
            es: "Holà que tal?"
        };
        let response = commonResponse;
        response.chat.participantID = "94e8c3b0-aeee-40e1-ba5a-a593c8047fc5";
        response.chat.dateFormat = "M/d/yyyy";
        response.chat.timeFormat = "h:mm:sstt";
        response.chat.chatID = "73db8632-9ee8-459e-a193-4d25684499d0";
        response.chat.events = [
            {
                "type": "text",
                "participantID": "00000000-0000-0000-0000- 000000000000",
                "sequenceNumber": this.getNextSeq(),
                "conversationSequenceNumber": 0,
                "contentType": "text/plain",
                "value": texts[startParams.WebSiteInfo.Language],
                "displayName": "IC",
                "participantType": "System"
            }, {
                "type": "participantState",
                "participantID": "00000000-0000-0000-0000- 000000000000",
                "sequenceNumber": this.getNextSeq() + 1,
                "state": "active",
                "displayName": startParams.Participant.LastName || "Anonymous",
                "participantType": "WebUser"
            }
        ];

        return [200, response];
    }

    //poll
    pollFake = (config) => {
        if (debugMode) console.log("**** mocking poll request ****", config.url);
        let response = commonResponse;
        response.chat.events = this.getRandomEvents(3);
        if (debugMode) console.log("**** mocking poll response ****", response);
        return [200, response];
    }

    //Send
    sendFake = (config) => {
        const data = JSON.parse(config.data);
        if (debugMode) console.log("**** mocking send request ****", data, config.url);
        let response = commonResponse;
        response.chat.events = [
            {
                "type": "text",
                "participantID": "94e8c3b0-aeee-40e1-ba5aa593c8047fc5",
                "sequenceNumber": this.getNextSeq(),
                "conversationSequenceNumber": 0,
                "contentType": "text/plain",
                "value": data.message || "...",
                "displayName": "John Doe",
                "participantType": "WebUser"
            }
        ];
        if (debugMode) console.log("**** mocking send response ****", response);
        return [200, response];
    }
}
//// MOCK REST API //