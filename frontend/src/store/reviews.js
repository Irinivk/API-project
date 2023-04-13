import { csrfFetch } from "./csrf"


export const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS'


export const getUserReviews = (reviews) => {
    return {
        type: LOAD_SPOT_REVIEWS,
        reviews
    }
}

const allReviews = (data) => {
        const allReviews = {};
        data.forEach(review => {
            allReviews[review.id] = review;
        });
        return allReviews;
}

export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    
        const SpotReviews = await res.json()
        // console.log(SpotReviews)
        const data = allReviews(SpotReviews.Reviews)
        dispatch(getUserReviews(data))
        return data
    
}


const initialState = { allReviews: {}, oneReview: {} }

const ReviewsReducer = (state = initialState, action) => {
    // let newState;
    switch (action.type) {
        case LOAD_SPOT_REVIEWS:
            // const newState = {...state }
            return { ...state, allReviews: { ...action.reviews } };
            // console.log(newState)
            // return newState
        default:
            return state
    }
}

export default ReviewsReducer


