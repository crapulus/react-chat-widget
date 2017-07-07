//common api response model
export const commonResponse = {
    chat: {
        pollWaitSuggestion: 2000,
        cfgVer: 1,
        status: {
            type: "success"
        },
        events: []
    }
}

//common api failure response model
export const commonResponseFail = {
    chat: {
        pollWaitSuggestion: 5000,
        cfgVer: 1,
        status: {
            type: "failure",
            error: "fake error #12345 from back-end"
        }
    }
}

//common api start parameters model
export const startParametersModel = {
    CustomerIdentifier: "76d6a924-567c-420b-9abc-e5ac34248300",
    Participant: {
        Firstname: "M.",
        LastName: "Customer",
        Email: "custommer@test.org",
        CustomerID: "0123456789"
    },
    WebSiteInfo: {
        PageID: "CONTACT",
        URL: "http://www.ininchat.n-allo.be/",
        Segment: "residential",
        Language: "nl",
        Version: "MOBILE",
        AutoTriggeredChat: "false"
    },
    CustomInfo: "TEST DATA\nMORE..."
}