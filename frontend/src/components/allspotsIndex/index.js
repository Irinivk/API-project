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
        <div title={spot.name} className="spot-card">
            <NavLink to={`/spots/${spot.id}`} >
                <div className='imagespot'>
                    <img src={spot.previewImage} alt="spot image" />
                </div>
                <div className="spot-details">
                    <h1 className="spot-place">{spot.city}, {spot.state}</h1>
                    <FontAwesomeIcon icon={faStar} size="xl" style={{ color: "#212121", }} />
                <div className="fa-solid fa-star">
                    <p>{num()}</p>
                </div>
            </div>
            <h2>${spot.price} night</h2>
            </NavLink>  
        </div>
    );


}


export default AllspotsIndex