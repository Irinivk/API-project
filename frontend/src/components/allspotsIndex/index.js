import './AllspotsIndex.css'
import { NavLink } from 'react-router-dom';


const AllspotsIndex = ({ spot }) => {

    
    
    function num() {
        return Number(spot.avgRating).toFixed(2);
    }

    return (
        <NavLink to={`/spots/${spot.id}`} className="spots-nav-link">
            <img src={spot.previewImage} alt={spot.name} className="img" />
            <h1>{spot.city}, {spot.state}</h1>
            <h2>${spot.price} night</h2>
            <h3>Rating {num()}</h3>
        </NavLink> 
    );

}


export default AllspotsIndex