import { useModal } from "../../context/Modal"
import { useParams } from "react-router-dom";


const ReviewForm = () => {

const { closeModal } = useModal();
const { spotId } = useParams()


console.log(spotId)

return (
    <h1>How was your stay?</h1>
)


} 

export default ReviewForm