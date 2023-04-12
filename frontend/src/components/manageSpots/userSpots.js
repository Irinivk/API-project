import { NavLink } from 'react-router-dom';

const ManageSpotsIndex = ({ spot }) => {

    function num() {
        return Number(spot.avgRating).toFixed(2);
    }
    
    return (
        <>
        <div>
            <h1>Manage Your Spots</h1>
            {!spot && 
                <NavLink to={'/spots/new'} >Create a New Spot</NavLink>
            }
        </div>
        <NavLink to={`/spots/${spot.id}`} className="spots-nav-link">
            <img src={spot.previewImage} alt={spot.name} className="img" />
            <h1>{spot.city}, {spot.state}</h1>
            <h2>${spot.price} night</h2>
            <h3>Rating {num()}</h3>
        </NavLink> 
        <NavLink to={`/spots/${spot.id}/edit`}>
            <button type="button">Update</button>
        </NavLink> 
            <button type="button">Delete</button>
        </>
    )
}

export default ManageSpotsIndex