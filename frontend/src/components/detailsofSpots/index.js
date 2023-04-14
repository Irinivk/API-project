import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { displaySpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import { fetchSpotReviews } from "../../store/reviews";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../reviewForm";


const SpotShow = () => {

    const { spotId } = useParams()

    const spots = useSelector(state => 
        state.spots ? state.spots[spotId] : null
        )
    
    const reviews = useSelector(state => Object.values(state.reviews.allReviews))
    // const newR = Object.values(reviews)

    const user = useSelector(state => state.session.user)

    // console.log(user)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(displaySpot(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        dispatch(fetchSpotReviews(spotId))
    }, [dispatch, spotId])


    // console.log(Object.values(reviews))

    // function num() {
    //     return Number(spots?.avgStarRating).toFixed(2);
    // }

    if (!spots) return null;

    if (!spots.Owner) return null

    function rev () {
        let word
        if (spots.numReviews === 1) {
            word = 'Review'
        } else {
            word = 'Reviews'
        } 
        
        if (!spots.avgStarRating || !spots.numReviews) {
            return 'New'
        } else {
            return Number(spots?.avgStarRating).toFixed(2) + ' ' + '·' + ' ' + spots.numReviews + ' ' + word
        }
    }

    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', {
            month: 'long',
        });
    }

    // function checkingUserReviewed () {
    //     const el = reviews.map((review) => {
    //         if (user.id === review.userId) {
    //             return null
    //         } else {
    //             return 
    //         }

    //     })

    //     return el
    //  }


    // const revid = reviews.map(review => {
    //     return review.id
    // })

    const revUserId = reviews.map(review => {
        return review.userId
    })

    // console.log(spots.ownerId)
    


    console.log(reviews)
    return (
        <>
        <div>
            <h1>{spots.name}</h1>
            <h2>{spots.city}, {spots.state}, {spots.country}</h2>
            <ul>
                {spots.SpotImages && spots.SpotImages.map(spot => {
                    return (
                        <img src={spot.url} alt='location' key={spot.url} />
                    )
                })}
            </ul>
                <h3>Hosted by {spots.Owner.firstName} {spots.Owner.lastName}</h3>
            <p>{spots.description}</p>
            
        </div>
        <div>
            <div>
                    <h4>${spots.price} night</h4> 
                    <FontAwesomeIcon icon={faStar} size="xl" style={{ color: "#212121", }} />
                    <h5>{rev()}</h5>
                    <button onClick={() => alert('Feature coming soon')}>Reserve</button>
            </div>
                <div>
                    <FontAwesomeIcon icon={faStar} size="xl" style={{ color: "#212121", }} />
                    <h6>{rev()}</h6>
                    {spots.ownerId !== user.id && user.id !== revUserId && user &&
                        <OpenModalButton 
                            buttonText="Post Your Review"
                            modalComponent={<ReviewForm spotId={spotId}/>}
                        />
                    }   
                </div>
                <div className='all-reviews'>
                    {reviews.length ? reviews.map(review =>
                        <>
                        <div>
                            
                        </div>
                        <div className='each-review' key={review.id}>
                            <p>{review.User.firstName}</p>
                            <p>{getMonthName(review.createdAt.split("")[6])}</p>
                            <p>{review.createdAt.split("-")[0]}</p>
                            <p>{review.review}</p>
                </div>
                    </>
                    ) : 'Be the first to post a review'}
            </div>
        </div>
        </>
    )

}

export default SpotShow