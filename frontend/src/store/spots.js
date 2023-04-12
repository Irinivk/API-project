import { csrfFetch } from "./csrf"

// Action Type Constants:

export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT'
export const CREATE_SPOT = "spots/CREATE_SPOT"
export const UPDATE_SPOT = "spots/UPDATE_SPOT"


//  Action Creators: 

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

export const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot
})

export const NewSpot = (spot) => ({
    type: CREATE_SPOT,
    spot
})

export const editSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})


// Thunk Action Creators: 

export const fetchspots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')

    if(res.ok) {
        const spots = await res.json()
        dispatch(loadSpots(spots))
    } 
};

export const displaySpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)

    if (res.ok) {
        const spotDetails = await res.json()
        dispatch(receiveSpot(spotDetails))
    } 
};


export const createSpot = (spots, spotImages) => async (dispatch) => {
    const res = await csrfFetch("/api/spots", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spots)
    })

    
        const newSpot = await res.json();

        newSpot.SpotImages = []
        for (let image of spotImages) {
            const spotImageResponse = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(image)
            });
                const spotImage = await spotImageResponse.json()
                newSpot.SpotImages.push(spotImage)
        }
    

    dispatch(NewSpot(newSpot))
    return newSpot
};

export const updateSpot = (spotId, spot) => async (dispatch) => {
    
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot),
        
    })
        
        const updatedSpot = await res.json()
        
        dispatch(editSpot(updatedSpot))
        return updatedSpot

}



export const fetchUsersSpot = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current')

    if (res.ok) {
        const spots = await res.json()
        dispatch(loadSpots(spots))
    }
}



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
        case CREATE_SPOT:
            return { ...state, [action.spot.id]: action.spot }
        case UPDATE_SPOT:
            return { ...state, [action.spot.id]: action.spot }
        default:
            return state
    }
}

export default SpotsReducer