import { deleteSpot } from "../../store/spots"
import { useDispatch } from "react-redux"
// import { useParams } from "react-router-dom"
// import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useModal } from "../../context/Modal"

const Deletespot = ({ spot }) => {

    // const { spotId } = useParams();

    // const spots = useSelector(state =>
    //     Object.values(state.spots)
    // )

    const { closeModal } = useModal();
    
    const dispatch = useDispatch();
    const history = useHistory()


    const handleDelete = (e) => {
        e.preventDefault();


       return dispatch(deleteSpot(spot))
           .then(history.push('/spots/current'))
           .then(closeModal())

       
        
    };

return (
    <div>
        <h1>Confrm Delete</h1>
        <h2>Are you sure you want to remove this spot
            from the listings?</h2>
        <form onSubmit={handleDelete}>
            <button type="submit" onClick={closeModal}> No(Keep Spot)</button>
            <button type="submit">Yes (Delete Spot)</button>
        </form>
    </div>
)
    
}

export default Deletespot