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
import './detailsofspot.css'


const SpotShow = () => {

    const { spotId } = useParams() 
    
    const dispatch = useDispatch()
    
    const spots = useSelector(state =>
        state.spots.singleSpot
        )
    const user = useSelector(state => state.session.user);
    const reviews = useSelector(state => Object.values(state.reviews.spot));
    // const reviews = Object.values(reviewsObj)


    useEffect(() => {
        dispatch(displaySpot(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        dispatch(fetchSpotReviews(spotId))
    }, [dispatch, spotId])
    //  let boo;

    //  console.log(spots)

    // useEffect(() => {


    //      return () => {
    //         if (!spots) return null;

    //         if (!spots.Owner) return null
            
    //         if (user === null) {
    //         boo = false
    //     } else if (reviews.length === 0 && spots.ownerId !== user.id) {
    //         boo = true
    //     } else {
    //         const revUserId = reviews.map(review => {
    //             // console.log(reviews.spot.length)
    //             return review.userId
    //         })
    //         revUserId.map((el) => {
    //             // console.log(rre.length)
    //             if (el.length === 0 || (el !== user.id && user !== null && spots.ownerId !== user.id)) {
    //                 boo = true
    //             } else {
    //                 boo = false
    //             }
    //         })
    //     }
    //     }

      
    // }, [user])



   if (!spots) return null;

    if (!spots.Owner) return null

    if (!reviews) return null;
    

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

    const revid = reviews.map(review => {
        return review.id
    })



  let boo;


    if (user === null) {
        boo = false
    } else if (user === null) {  
         boo = false
    } else if (reviews.length === 0 && spots.ownerId !== user.id) {
        boo = true
    } else {
        const revUserId = reviews.map(review => {
        // console.log(reviews.spot.length)
        return review.userId
    })
          revUserId.map((el) => {
        // console.log(rre.length)
        if (el.length === 0 || (el !== user.id && user !== null && spots.ownerId !== user.id)) {
             boo = true
        } else {
             boo = false
        }
    })
    }
    


    
    return (
        <div className="all-spot-details">
        <div className="spot-info">
            <div className="spot-details-title-name">
                <h1>{spots.name}</h1>
                <h2>{spots.city}, {spots.state}, {spots.country}</h2>
            </div>
                <div className="spot-img-box">
                    <img src={spots.SpotImages[0].url}></img>
                    <div className="nested-img-box">
                        {spots.SpotImages.length > 1 && <img src={spots.SpotImages[1].url}></img>}
                        {spots.SpotImages.length > 2 && <img src={spots.SpotImages[2].url}></img>}
                    </div>
                    <div className="nested-img-box">
                        {spots.SpotImages.length > 3 && <img src={spots.SpotImages[3].url}></img>}
                        {spots.SpotImages.length > 4 && <img src={spots.SpotImages[4].url}></img>}
                    </div>
        
            </div>
                
            <div className="info-box">
                    <div className="spot-owner-info">
                        <h3>Hosted by {spots.Owner.firstName} {spots.Owner.lastName}</h3>
                         <p>{spots.description}</p>
                    </div>
                        <div className='reserve-box'> 
                            <div className="icon-reserve-box">
                            <h4>${spots.price} night</h4>
                            <div className="second-icon-rev"> 
                                <FontAwesomeIcon icon={faStar} size="xl" style={{ color: "#212121", }} className='the-icon' />
                                <h5>{rev()}</h5>
                            </div>
                            
                            </div>
                            <div className="reserve-box-button">
                                <button onClick={() => alert('Feature coming soon')}>Reserve</button>
                            </div>
                            
                        </div>
                    
            </div>
        </div>
        <div className="review-and-box">
            <div className="reviews-details">
                <div className="rev-star">
                    <FontAwesomeIcon icon={faStar} size="xl" style={{ color: "#212121", }} />
                    <h6>{rev()}</h6>
                    
                    
                </div>
                    <div className="post-your-review-now">
                        {boo &&
                        <OpenModalButton 
                            buttonText="Post Your Review"
                            modalComponent={<ReviewForm spotId={spotId}/>}
                        />
                    } 
                    </div>
                <div className="reviews-box">
                    {reviews.length > 0 && reviews.slice().reverse().map(review => {
                        return (
                            <div key={review.id} className="one-review-box">
                             <h4>{review.User && review.User.firstName}</h4>
                             <div className="review-created-at">
                                <p>{getMonthName(review.createdAt.split("")[6])}, {review.createdAt.split("-")[0]}</p>
                             </div>
                             <p>{review.review}</p>
                            <div className="delete-your-review">
                                {user && user.id === review.userId &&
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
            </div>
        </div>
        </div>
    )

}

export default SpotShow