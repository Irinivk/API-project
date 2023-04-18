import { csrfFetch } from "./csrf"
import { displaySpot } from "./spots"


export const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS'
export const CREATE_REVIEWS = "reviews/CREATE_REVIEWS"
export const REMOVE_REVIEW = 'review/REMOVE_REVIEW'


export const getUserReviews = (reviews) => {
    return {
        type: LOAD_SPOT_REVIEWS,
        reviews
    }
}

export const newReview = (review) => {
    return {
    type: CREATE_REVIEWS,
    review
    }  
}

export const removeReview = (reviewId) => {
    return {
        type: REMOVE_REVIEW,
        reviewId
    }
}

// const allReviews = (data) => {
//         const allReviews = {};
//         data.forEach(review => {
//             allReviews[review.id] = review;
//         });
//         return allReviews;
// }

export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    
        const reviews = await res.json()
        // console.log(SpotReviews.Reviews)
        // const data = allReviews(SpotReviews.Reviews)
        dispatch(getUserReviews(reviews.Reviews))
    
}

export const createReview = (payload, spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        if (res.ok) {
            const review = await res.json()
            // console.log(review)
            dispatch(newReview(review))
            return review
    }
    } catch (e) {
    const data = await e.json()
    return data;
}
    
}

export const deleteReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
        dispatch(removeReview(reviewId))
    }
}


const initialState = { spot: {}, user: {} };

const ReviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SPOT_REVIEWS:
        console.log(action.reviews)
            newState = { ...state, spot: {}, user: {} };
        console.log(newState)
            action.reviews.forEach(review => newState.spot[review.id] = review)
    
            return newState
        case CREATE_REVIEWS:

            newState = { ...state, spot: { ...state.spot }, user: {} }
            newState.spot[action.review.id] = action.review;
            return newState

        case REMOVE_REVIEW:


            newState = { ...state, spot: { ...state.spot }, user: {} }
            delete newState.spot[action.reviewId]
            return newState

        default:
            return state
    }
}

export default ReviewsReducer


