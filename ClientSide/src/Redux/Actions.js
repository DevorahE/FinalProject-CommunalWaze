export const ConnectUser = (value) => {
    return { type: 'CONNECT-USER', payload: value }
}

export const AddPoint = (value) => {
    debugger
    return { type: 'ADD-POINT', payload: value }
}

export const DeletePoint = (value) => {
    debugger
    return { type: 'DELETE-POINT', payload: value }
}

export const SetOrigin = (value) => {

    return { type: 'SET-ORIGIN', payload: value }
}

export const SetDestination = (value) => {

    return { type: 'SET-DESTINATION', payload: value }
}
export const SetTransport = (value) => {
    return { type: 'SET-TRANSPORT', payload: value }
}
export const SetColor = (value) => {
    return { type: 'SET-COLOR', payload: value }
}
export const SetRenew = (value) => {
    return { type: 'SET-RENEW', payload: value }
}
export const SetLanguage = (value) => {
    return { type: 'SET-LANGUAGE', payload: value }
}
export const SetLetsGo = (value) => {
    return { type: 'SET-LETSGO', payload: value }
}
export const SetAddRouteReport = (value) => {
    return { type: 'SET-ADD-ROUTE-REPORT', payload: value }
}
