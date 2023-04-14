import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { displaySpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import { fetchSpotReviews } from "../../store/reviews";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../reviewForm";
import DeletingReview from "../deleteReview";


const SpotShow = () => {

    const { spotId } = useParams() 
    
    const dispatch = useDispatch()

    // const spots = useSelector(state => 
    //     state.spots.singleSpot ? state.spots.singleSpot[spotId] : null
    //     )

        //  const spots = useSelector(state =>
        // console.log(state.spots.singleSpot)
        // )
    
    const spots = useSelector(state =>
        state.spots.singleSpot
        )
    const user = useSelector(state => state.session.user);
    const reviewsObj = useSelector(state => state.reviews.spot);
    const reviews = Object.values(reviewsObj)


    useEffect(() => {
        dispatch(displaySpot(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        dispatch(fetchSpotReviews(spotId))
    }, [dispatch, spotId])
    

    // console.log(reviewsObj)
    // console.log(reviews)
    // console.log(spots)

   if (!spots) return null;

    if (!spots.Owner) return null

    if (!reviews) return null;


    // const revn = useSelector(state => state.reviews.allReviews)
    // const reviews = Object.values(revn)

    // const user = useSelector(state => state.session.user)

    // console.log(user)

    

    // console.log('details of spot the spot received info ------> ', spots)
    // console.log(Object.values(reviews))

    // function num() {
    //     return Number(spots?.avgStarRating).toFixed(2);
    // }

 

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


    const revid = reviews.map(review => {
        return review.id
    })

    const revUserId = reviews.map(review => {
        return review.userId
    })


    // const el = reviews.map(review => {
    //     return review
    // })

    // console.log('deatailes of spots component reviews ----------> ', el[7].firstName)

    // let al = el[7][0].firstName

    let boo;

    // console.log(revUserId)

    revUserId.map((el) => {
        if (el !== user.id || user || spots.ownerId !== user.id) {
            boo = true
        } if (el === user.id || !user || spots.ownerId === user.id) {
            boo = false
        }
    })
    
    // console.log(boo)

    // console.log(reviews)
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
                    {boo &&
                        <OpenModalButton 
                            buttonText="Post Your Review"
                            modalComponent={<ReviewForm spotId={spotId}/>}
                        />
                    }   
                </div>
                {/* <div className='all-reviews'>
                    {reviews.length > 0 ? reviews.slice().reverse().map(review =>
                
                        <div className='each-review' key={review.id}>
                            <p>{review.User.firstName}</p> 
                            <p>{getMonthName(review.createdAt.split("")[6])}</p>
                            <p>{review.createdAt.split("-")[0]}</p>
                            <p>{review.review}</p>
                        <div>
                            {user.id === review.userId &&
                                <OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={<DeletingReview review={review} />}
                                />
                            }
                        </div>
                         </div>
                    ) : 'Be the first to post a review'}
            </div> */}
                {reviews.length > 0 && reviews.slice().reverse().map(review => {
                    return (
                        <div key={review.id} className="one-review-box">
                            <h4>{review.User && review.User.firstName}</h4>
                            <p>{getMonthName(review.createdAt.split("")[6])}</p>
                            <p>{review.createdAt.split("-")[0]}</p>
                            <p>{review.review}</p>
                            <div>
                                {user.id === review.userId &&
                                    <OpenModalButton
                                        buttonText="Delete"
                                        modalComponent={<DeletingReview review={review} />}
                                    />
                                }
                            </div>
                        </div>
                    )
                })}
        </div>
        </>
    )

}

export default SpotShow