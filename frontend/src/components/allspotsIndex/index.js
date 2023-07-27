import './AllspotsIndex.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom';


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
        <div title={spot.name} className="spot-card" data-tooltip={spot.name}>
            <NavLink to={`/spots/${spot.id}`} className="link">
                <div className='imagespot'>
                    <img src={spot.previewImage} alt="spot" />
                </div>
                <div className="spot-details">
                    <h1>{spot.city}, {spot.state}</h1>
                <div className='icons'>
                    <FontAwesomeIcon icon={faStar} size="1x" style={{ color: "#212121", }} />
                    <p>{num()}</p>
                </div>    
                </div>
            <h2>${spot.price} night</h2>
            </NavLink>  
        </div>
    );


}


export default AllspotsIndex