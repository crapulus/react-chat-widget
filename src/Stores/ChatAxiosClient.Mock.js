import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {commonResponse, commonResponseFail} from './ChatCommonResponseModels';

// MOCK REST API //
const mock = new MockAdapter(axios, {delayResponse: 500});
mock.sequenceNumber = 0;

//start
mock
    .onPost(/chat\/start/)
    .reply(function (config) {
        const startParams = JSON.parse(config.data);
        console.warn("**** mocking start ****", startParams, startParams.WebSiteInfo.Language);
        mock.sequenceNumber++;
        let texts = {fr:"Bienvenue!", nl:"Welkom!", en:"Welcome!"};
        return [
            200, {
                chat: {
                    pollWaitSuggestion: 3000,
                    cfgVer: 1,
                    participantID: "94e8c3b0-aeee-40e1-ba5a-a593c8047fc5",
                    dateFormat: "M/d/yyyy",
                    timeFormat: "h:mm:sstt",
                    chatID: "73db8632-9ee8-459e-a193-4d25684499d0",
                    status: {
                        type: "success"
                    },
                    events: [
                        {
                            "type": "text",
                            "participantID": "00000000-0000-0000-0000- 000000000000",
                            "sequenceNumber": mock.sequenceNumber,
                            "conversationSequenceNumber": 0,
                            "contentType": "text/plain",
                            "value": texts[startParams.WebSiteInfo.Language],
                            "displayName": "IC",
                            "participantType": "System"
                        }, {
                            "type": "participantState",
                            "participantID": "00000000-0000-0000-0000- 000000000000",
                            "sequenceNumber": mock.sequenceNumber + 1,
                            "state": "active",
                            "displayName": startParams.Participant.LastName || "Anonymous",
                            "participantType": "WebUser"
                        }
                    ]
                 }
            }
        ];
    });

//poll
mock
    .onGet(/chat\/poll/)
    .reply(function (config) {
        const data = JSON.parse(config.data);
        console.warn("**** mocking poll request ****", data, config.url);
        mock.sequenceNumber++;
        let response = commonResponse;
        response.events = [
            {
                "type": "text",
                "participantID": "94e8c3b0-aeee-40e1-ba5aa593c8047fc5",
                "sequenceNumber": mock.sequenceNumber,
                "conversationSequenceNumber": 0,
                "contentType": "text/plain",
                "value": "Sample message from agen :-)",
                "displayName": "Marc",
                "participantType": "Agent"
            }
        ];
        console.warn("**** mocking poll response ****", response);
        return [200, { chat: response }];
    });
//Send
mock
    .onPost(/chat\/sendmessage/)
    .reply(function (config) {
        const data = JSON.parse(config.data);
        console.warn("**** mocking send request ****", data, config.url);
        mock.sequenceNumber++;
        let response = commonResponse;
        response.events = [
            {
                "type": "text",
                "participantID": "94e8c3b0-aeee-40e1-ba5aa593c8047fc5",
                "sequenceNumber": mock.sequenceNumber,
                "conversationSequenceNumber": 0,
                "contentType": "text/plain",
                "value": data.message || "...",
                "displayName": "John Doe",
                "participantType": "WebUser"
            }
        ];
        console.warn("**** mocking send response ****", response);
        return [200, { chat: response }];
    });
//test / test ko
mock
    .onGet(/test/)
    .reply(200, commonResponse);
mock
    .onGet(/fail/)
    .reply(200, commonResponseFail);
//disconnect
mock
    .onPost(/chat\/disconnect/)
    .reply(200, commonResponse);

//typing
mock
    .onPost(/chat\/setTypingState/)
    .reply(200, commonResponse);
//reconnect
mock
    .onPost(/chat\/reconnect/)
    .reply(200, commonResponse);


//// MOCK REST API //

export default mock
