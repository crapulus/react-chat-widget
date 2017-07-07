import axios from 'axios';

const debugMode = true; //verbose store output not for prod!!!

////LOCAL REST MPOCKS for dev
// eslint-disable-next-line
import mock from './ChatAxiosClient.Mock';

axios.rootUri =  "https://chatapi-dev.n-allo.be/api/";
//axios.rootUri =  "http://chatapi.n-allo.be/api/";//PROD
//axios.rootUri =  "http://chatapi-dev.n-allo.be/api/";//DEV/ACC PUBLIC: FAILED 404
//axios.rootUri =  "http://chat-acc.engie-electrabel.be/api/";//ACC PUBLIC

axios
    .interceptors
    .response
    .use((response) => {
        //console.info("intercepted response status:", response.status);
        // if (response.data.chat.events) {
        //    // console.info("intercepted response with events:", response.data.chat.events);
        // } 
        return response;
    }, (error) => {
        console.warn("error in api response:", error)
    });


export default class ChatClient {
    constructor() {
        if (debugMode) console.log("init chatclient: ", axios.rootUri);
    }
    start = (params) => {       
        if (debugMode) console.log("sending start (p, default): " + axios.rootUri + "chat/start", params);
        return axios
            .post(axios.rootUri+"chat/start", params);         
    }

    poll = (participantId) => {        
        return axios.get(`${axios.rootUri}chat/poll/${participantId}`);
    }

    send = (pid, messageText) => {
        return axios.post(`${axios.rootUri}chat/sendmessage/${pid}`, {message: messageText});         
    }

    setTypingState = (pid, typingState) => {
        return axios.post(`${axios.rootUri}chat/setTypingState/${pid}`, {typingIndicator: typingState});         
    }

    disconnect = (participantId) => {
        return axios.post(`${axios.rootUri}chat/disconnect/${participantId}`);         
    }

    reconnect = (chatid) => {
        return axios.post(`${axios.rootUri}chat/reconnect/${chatid}`);         
    }

    test = () => {
        axios
            .get(axios.rootUri+"test")
            .then((result) => {
                console.log("test done", result.data);
            })
            .catch((err) => {
                console.error("test error", err);
                return null;
            })
    }
}
