import './AllspotsIndex.css'
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'


const AllspotsIndex = ({ spot }) => {

    
    
    function num() {
        if (typeof spot.avgRating === 'string') {
            spot.avgRating = 'NEW'
            return spot.avgRating
        } else {
           return 'Rating' + ' ' + Number(spot.avgRating).toFixed(2);
        }
    }

    return (
        <NavLink to={`/spots/${spot.id}`} className="spots-nav-link">
            <img src={spot.previewImage} alt={spot.name} className="img" />
            <h1>{spot.city}, {spot.state}</h1>
            <FontAwesomeIcon icon={faStar} size="xl" style={{ color: "#212121", }} />
            <div>
                <p>{num()}</p>
            </div>
            
            <h2>${spot.price} night</h2>
        </NavLink> 
    );

}


export default AllspotsIndex