import { NavLink } from 'react-router-dom';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import Deletespot from '../DeleteSpot';

const ManageSpotsIndex = ({ spot }) => {

    function num() {
        return Number(spot.avgRating).toFixed(2);
    }
    
    return (
        <>
        <div>
            {!spot && 
                <NavLink to={'/spots/new'} >Create a New Spot</NavLink>
            }
        </div>
        <div>
        <div>
                <NavLink to={`/spots/${spot.id}`} className="spots-nav-link">
                    <img src={spot.previewImage} alt={spot.name} className="img" />
                    <h1>{spot.city}, {spot.state}</h1>
                    <h2>${spot.price} night</h2>
                    <h3>Rating {num()}</h3>
                </NavLink> 
        </div>
        <div>
                <NavLink to={`/spots/${spot.id}/edit`}>
                    <button type="button">Update</button>
                </NavLink> 
        </div>
                <OpenModalMenuItem
                    itemText="Delete"
                    modalComponent={<Deletespot spot={spot} />}
                />
        </div>
        </>
        
    )
}

export default ManageSpotsIndex