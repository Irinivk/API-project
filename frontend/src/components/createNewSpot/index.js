import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSpot } from "../../store/spots";
import { useSelector } from "react-redux";


const SpotForm = () => {
    const history = useHistory()

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [latitude, setLatitude] = useState()
    const [longitude, setLongitude] = useState()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState()
    const [errors, setErrors] = useState([]);
    const [prevImage, setPrevImage] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    

    const dispatch = useDispatch()

    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        const errors = ([])

        if (!country.length) errors.country = 'Country is required'
        if (!address.length) errors.address = 'Address is required'
        if (!city.length) errors.city = 'City is required'
        if (!state.length) errors.state = 'State is required'
        if (!latitude) errors.latitude = 'Latitude is required'
        if (!longitude) errors.longitude = 'Longitude is required'
        if (description.length < 30) errors.description = 'Description needs a minimum of 30 characters'
        if (!name.length) errors.name = 'Name is required'
        if (!price) errors.price = 'Price is required'
        if (!prevImage.length) errors.prevImage = 'Preview image is required.'
        if (image1.length === 0 && image1.endsWith('.png,' && image1.endsWith('.jpg') && image1.endsWith('.jpeg'))) errors.image1 = 'Image URL must end in .png, .jpg, or .jpeg'

        setErrors(errors)
    }, [country, address, city, state, latitude, longitude, description, name, price])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        const spot = {
            ownerId: sessionUser.id,
            address,
            city,
            state,
            country,
            lat: latitude,
            lng: longitude,
            name,
            description,
            price
        };

        const newImages = [
            {url: prevImage, preview: true},
            { url: image1, preview: false },
            { url: image2, preview: false },
            { url: image3, preview: false },
            { url: image4, preview: false }
        ]

        const newspot = await dispatch(createSpot(spot, newImages))


        if (newspot.errors) {
            setErrors(newspot.errors)
        } else {
            history.push(`/spots/${newspot.id}`)
        }

        
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create New Spot</h1>
            <h2>Where's your place located?</h2>
            <p>Guests will only get your exact address once they booked a
                reservation.</p>
            <ul>
                {errors.map((error, id) => (
                    <li key={id}>{error}</li>
                ))}
            </ul>
            <div>
                <label>
                    Country
                <input 
                type="text" 
                id="country" 
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
               />
                </label>
                <p className="errors">{errors.country}</p>
                <label>
                    Street Address
                    <input
                        type="text"
                        id="Address"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                <p className="errors">{errors.address}</p>
                <label>
                    City
                    <input
                        type="text"
                        id="City"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </label>
                <p className="errors">{errors.city}</p>
                <label>
                    State
                    <input
                        type="text"
                        id="State"
                        placeholder="STATE"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </label>
                <p className="errors">{errors.state}</p>
                <label>
                    Latitude
                    <input
                        type="text"
                        id="Latitude"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                </label>
                <p className="errors">{errors.latitude}</p>
                <label>
                    Longitude
                    <input
                        type="text"
                        id="Longitude"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                </label>
                <p className="errors">{errors.longitude}</p>
            </div>
            <div>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like
                    fast wifi or parking, and what you love about the neighborhood.</p>
                <input
                    type="text"
                    id="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <p className="errors">{errors.description}</p>
            </div>
            <div>
                <h4>Create a title for your spot</h4>
                <p>Catch guests' attention with a spot title that highlights what makes
                    your place special.</p>
                <input
                    type="text"
                    id="name"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <p className="errors">{errors.name}</p>
            </div>
            <div>
                <h5>Set a base price for your spot</h5>
                <p>Competitive pricing can help your listing stand out and rank higher
                    in search results.</p>
                <input
                    type="text"
                    id="price"
                    placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <p className="errors">{errors.price}</p>
            </div>
            <div>
                <h6>Liven up your spot with photos</h6>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input
                    type="text"
                    id="prevImage"
                    placeholder="Preview Image URL"
                    value={prevImage}
                    onChange={(e) => setPrevImage(e.target.value)}
                />
                <p className="errors">{errors.prevImage}</p>
                <input
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={image1}
                    onChange={(e) => setImage1(e.target.value)}
                />
                <p className="errors">{errors.image1}</p>
                <input
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                />
                <input
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={image3}
                    onChange={(e) => setImage3(e.target.value)}
                />
                <input
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={image4}
                    onChange={(e) => setImage4(e.target.value)}
                />
            </div>
            <button 
            type="submit"
            disabled={Boolean(Object.values(errors).length)}
            >
            Create Spot
            </button>
        </form>
    )


}

export default SpotForm