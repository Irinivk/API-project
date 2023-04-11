import { csrfFetch } from "./csrf"

// Action Type Constants:

export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT'


//  Action Creators: 

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

export const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot
})



// Thunk Action Creators: 

export const fetchspots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')

    if(res.ok) {
        const spots = await res.json()
        dispatch(loadSpots(spots))
    }
}

export const displaySpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)

    if (res.ok) {
        const spotDetails = await res.json()
        dispatch(receiveSpot(spotDetails))
    }
}





// Spots Reducer:

// const initialState = { allSpots: {} }

const SpotsReducer = (state = {}, action) => {
    switch(action.type) {
        case LOAD_SPOTS:
            // console.log(action.spots.Spots)
            const spotsstate = {...state};
            action.spots.Spots.forEach((spot) => {
                spotsstate[spot.id] = spot
            });
            return spotsstate
        case RECEIVE_SPOT:
           return {...state, [action.spot.id]: action.spot}
        default:
            return state
    }
}

export default SpotsReducer