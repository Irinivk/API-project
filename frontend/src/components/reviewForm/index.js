import { useModal } from "../../context/Modal"
// import { useParams } from "react-router-dom";
import { createReview } from "../../store/reviews";
import { useState } from "react";
import Rate from "../rating";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import './reviewform.css'



const ReviewForm = ({spotId}) => {
const history = useHistory()

const { closeModal } = useModal();
// const { spotId } = useParams()
const [rating, setRating] = useState(0);
const [errors, setErrors] = useState({});
const [review, setReview] = useState('')

const dispatch = useDispatch()

// console.log(spotId)

useEffect(() => {
     const errors = {}

    if (!rating) errors.rating = 'No Stars chosen'
    if (review.length < 10) errors.review = 'Review must be more then 10 characters'


    setErrors(errors)
}, [rating, review])

const handleSubmit = async (e) => {
    e.preventDefault();

    const newrev = {
        review,
        stars: rating
    }

    const thenewReview = await dispatch(createReview(newrev, spotId))
      
    if (thenewReview.message) {
        setErrors(thenewReview)
    } else {
        history.push(`/spots/${spotId}`)
        closeModal()
    }
}

return (
    <>
        <h1>How was your stay?</h1>
        {Object.values(errors).length > 0 && <p className="errors">{errors.message}</p>}
        <form onSubmit={handleSubmit} className='post-new-review-form'>
            <input 
                type="text" 
                id="stay" 
                placeholder="Leave your review here..."
                value={review}
                onChange={e => setReview(e.target.value)}
            />
            <div className="stars-post-review">
                <Rate rating={rating} onRating={(rate) => setRating(rate)} />
                <h2>Stars</h2>
            </div>
            
            <button
                type="submit"
                disabled={Boolean(Object.values(errors).length)}
            >
                Submit Your Review
            </button>
        </form>
    </>
)


} 

export default ReviewForm