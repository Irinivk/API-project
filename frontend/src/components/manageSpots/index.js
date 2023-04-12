import ManageSpotsIndex from "./userSpots"
import { fetchUsersSpot } from "../../store/spots"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const ManageSpots = () => {

    const dispatch = useDispatch()

    const spots = useSelector(state => Object.values(state.spots))

    useEffect(() => {
        dispatch(fetchUsersSpot())
    }, [dispatch])

    return (
        <div>
            {spots.map(spot => (
                <ManageSpotsIndex
                    spot={spot}
                    key={spot.id}
                />
            ))}
        </div>
    )
}

export default ManageSpots