import { csrfFetch } from "./csrf"


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

export const createReview = (newreview, spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newreview)
    })
        if (res.ok) {
    const review = await res.json()
    console.log(review)
    dispatch(newReview(newReview(review)))
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


const initialState = { allReviews: {}, oneReview: {} }

const ReviewsReducer = (state = initialState, action) => {
    // let newState;
    switch (action.type) {
        case LOAD_SPOT_REVIEWS:
            // const newState = {...state }
            return { ...state, allReviews: { ...action.reviews } };
            // console.log(newState)
            // return newState
        case CREATE_REVIEWS:
            console.log(action.review.review)
            // const newState = { ...state, allReviews:{} }
            // newState.oneReview = action.review
            // return newState
            return { ...state, [action.review.id]: action.review }
        case REMOVE_REVIEW:
            const newState = { ...state };
            delete newState[action.reviewId];
            return newState;
        default:
            return state
    }
}

export default ReviewsReducer


