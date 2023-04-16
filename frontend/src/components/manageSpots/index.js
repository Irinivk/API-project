import ManageSpotsIndex from "./userSpots"
import { fetchUsersSpot } from "../../store/spots"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import './indexspots.css'

const ManageSpots = () => {

    const dispatch = useDispatch()

    const spots = useSelector(state => Object.values(state.spots))

    // console.log(Object.values(spots))
    
    useEffect(() => {
        dispatch(fetchUsersSpot())
    }, [dispatch])

    // if (!spots) return null

    return (
        <div className="all">
            <div className="title">
                <h1>Manage Your Spots</h1>
            </div >
            <div className="spotCards">
                {spots.map(spot => (
                    <ManageSpotsIndex
                         spot={spot}
                         key={spot.id}
                    />
                 ))}
            </div>
            
        </div>
    )
}

export default ManageSpots