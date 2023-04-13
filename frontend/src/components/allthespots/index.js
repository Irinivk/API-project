import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchspots } from "../../store/spots";
import AllspotsIndex from "../allspotsIndex/index";
import './Allspots.css'

const Allthespots = () => {
    const dispatch = useDispatch()


    const spots = useSelector(state => Object.values(state.spots)) 
    
    useEffect(() => {
        dispatch(fetchspots())
    }, [dispatch])

    // if (!spots) return null;
    return (
        <div>
                {spots.map(spot => (
                    <AllspotsIndex
                    spot={spot}
                    key={spot.id}
                    />
                ))}
        </div>
    )

}

export default Allthespots