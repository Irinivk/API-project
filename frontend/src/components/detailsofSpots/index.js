import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { displaySpot } from "../../store/spots";
import { useParams } from "react-router-dom";


const SpotShow = () => {

    const { spotId } = useParams()

    const spots = useSelector(state => 
        state.spots ? state.spots[spotId] : null
        )


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(displaySpot(spotId))
    }, [dispatch, spotId])


    return (
        <>
        <div>
            <h1>{spots?.name}</h1>
            <h2>{spots?.city}, {spots?.state}, {spots?.country}</h2>
            <ul>
                {spots?.SpotImages && spots?.SpotImages.map(spot => {
                    return (
                        <img src={spot.url} alt='location' key={spot.url} />
                    )
                })}
            </ul>
                <h3>Hosted by {!spots?.Owner?.firstName ? null : spots?.Owner?.firstName} {!spots?.Owner?.lastName ? null : spots?.Owner?.lastName}</h3>
            <p>{spots?.description}</p>
            {!spots?.avgStarRating &&
                <p>New</p>
            }
                <p>{spots?.avgStarRating.toFixed(2)} · {spots?.numReviews} Review</p>
        </div>
        <div>
            <p>${spots?.price} night</p>
             <button onClick={() => alert('Feature coming soon')}>Reserve</button>
        </div>
        </>
    )

}

export default SpotShow