import { NavLink } from 'react-router-dom';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import Deletespot from '../DeleteSpot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import './userspots.css'


const ManageSpotsIndex = ({ spot }) => {

    function num() {
        if (spot.avgRating === null) {
            return 'NEW'
        } else {
            return 'Rating' + ' ' + Number(spot.avgRating).toFixed(2);
        }
    }
    
    // console.log(spot)
    return (
        <div className='allyourspots'>
                <div className='userspotcard'  data-tip={spot.name}>
                    <div>
                        <NavLink to={`/spots/${spot.id}`} className="spots-nav-link">
                            <div className='userspotimage'>
                                <img src={spot.previewImage} alt={spot.name} className="img" />
                            </div>
                            <div className='user-spot-details'>
                                <h1>{spot.city}, {spot.state}</h1>
                            <div className='user-icons'>
                                <FontAwesomeIcon icon={faStar} size="l" style={{ color: "#212121", }} />
                                <p>{num()}</p>
                            </div>  
                            </div>
                                <h2>${spot.price} night</h2>
                        </NavLink> 
                    </div>
                    <div className='user-buttons'>
                        <NavLink to={`/spots/${spot.id}/edit`} className='user-update'>
                            <button type="button">Update</button>
                        </NavLink> 
                        
                         <OpenModalMenuItem
                             itemText="Delete"
                             className='user-delete'
                             modalComponent={<Deletespot spot={spot} />}
                         /> 
                    </div>
                    </div>
                </div>
        
    )
}

export default ManageSpotsIndex