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