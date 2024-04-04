import produce from 'immer';
import { createStore } from 'redux';

const myState = {
    //Current user
    user: {},
    //Origin point
    origin: {
        lat: 0,
        lng: 0,
        formattedAddress: ''
    },
    //Destination point
    destination: {
        lat: 0,
        lng: 0,
        formattedAddress: ''
    },
    //The points to go through
    point: [],
    //Mode of transport
    transport: 'DRIVING',
    //Color of the category you want to see the reports
    color: -1,
    renew: false,
    //Site language
    language: 'he',
    //Whether to start the route
    letsGo: false,
    //Did tap add report as source or destination
    addRouteReport: ""
}

const reducer = produce(
    (state, action) => {
        debugger;
        switch (action.type) {

            case 'CONNECT-USER': {

                state.user = action.payload
                break
            }
            case 'ADD-POINT': {
                debugger;
                state.point.push(action.payload)
                break
            }
            case 'DELETE-POINT': {
                debugger
                state.point = state.point.filter(x => x.location.lat !== action.payload.location.lat &&
                    x.location.lng !== action.payload.location.lng);
                break
            }

            case 'SET-ORIGIN': {
                state.origin = action.payload
                break
            }
            case 'SET-DESTINATION': {
                state.destination = action.payload
                break
            }
            case 'SET-TRANSPORT': {
                state.transport = action.payload
                break
            }
            case 'SET-COLOR': {
                state.color = action.payload
                break
            }
            case 'SET-RENEW': {
                state.renew = action.payload
                break
            }
            case 'SET-LANGUAGE': {
                state.language = action.payload
                break
            }
            case 'SET-LETSGO': {
                state.letsGo = action.payload
                break
            }
            case 'SET-ADD-ROUTE-REPORT': {
                state.addRouteReport = action.payload
                break
            }
        }
    }
    , myState
)
const store = createStore(reducer)
window.store = store
export default store
