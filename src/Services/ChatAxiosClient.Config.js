import { commonResponseFail } from './ChatCommonResponseModels';

const config = {
    debugMode: true, //verbose store output not for prod!!!
    rootUri: "https://chatapi-acc.n-allo.be/api/",
    responseHook: (response) => {
        //console.info("intercepted response status:", response.status);
        // if (response.data.chat.events) {
        //    // console.info("intercepted response with events:", response.data.chat.events);
        // } 
        return response;
        },
    errorHook: (error) => {
        console.warn("error in api response:", error);
        return commonResponseFail; //??
       }
}

export default config;

// OTHER URL'S
//axios.rootUri =  "http://chatapi.n-allo.be/api/";//PROD
//axios.rootUri =  "http://chatapi-acc.n-allo.be/api/";/ACC 
//axios.rootUri =  "http://chatapi-dev.n-allo.be/api/";//DEV 