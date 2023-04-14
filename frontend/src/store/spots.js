import { csrfFetch } from "./csrf"

// Action Type Constants:

export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT'
export const CREATE_SPOT = "spots/CREATE_SPOT"
export const UPDATE_SPOT = "spots/UPDATE_SPOT"
export const REMOVE_SPOT = "spots/REMOVE_SPOT"
export const LOAD_USER_SPOTS = "spots/loadUserSpots";


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

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
})

export const getUserSpots = (spots) => {
    return {
        type: LOAD_USER_SPOTS,
        spots
    }
}


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
        dispatch(getUserSpots(spots))
        return spots
    }
}

export const deleteSpot = (spot) => async (dispatch) => {
    const res = csrfFetch(`/api/spots/${spot.id}`, {
        method: 'DELETE'
    })

    // const delres = await res.json()
    dispatch(removeSpot(spot))
}


const initialState = {userSpots: {}, allSpots: {}}
const SpotsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_SPOTS:
            const spotsstate = { ...initialState.allSpots };
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
        case LOAD_USER_SPOTS:
            const Userstate = { ...initialState.userSpots };
            action.spots.Spots.forEach((spot) => {
                Userstate[spot.id] = spot
            });
            return Userstate
        case REMOVE_SPOT:
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        default:
            return state
    }
}

export default SpotsReducer