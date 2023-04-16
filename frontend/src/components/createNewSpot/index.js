import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSpot } from "../../store/spots";
import { useSelector } from "react-redux";
import { addImage } from "../../store/spots";
import './createnewspot.css'


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
    const [errors, setErrors] = useState({});
    const [prevImage, setPrevImage] = useState({ url: "", preview: 1 })
    const [image1, setImage1] = useState({ url: "", preview: 0 })
    const [image2, setImage2] = useState({ url: "", preview: 0 })
    const [image3, setImage3] = useState({ url: "", preview: 0 })
    const [image4, setImage4] = useState({ url: "", preview: 0 })
    

    const dispatch = useDispatch()

    const sessionUser = useSelector(state => state.session.user);


    const handleSubmit = async (e) => {
        e.preventDefault();


        const err = {}

        if (!country.length) err.country = 'Country is required'
        if (!address.length) err.address = 'Address is required'
        if (!city.length) err.city = 'City is required'
        if (!state.length) err.state = 'State is required'
        if (!latitude) err.latitude = 'Latitude is required'
        if (!longitude) err.longitude = 'Longitude is required'
        if (description.length < 30) err.description = 'Description needs a minimum of 30 characters'
        if (!name.length) err.name = 'Name is required'
        if (!price) err.price = 'Price is required'
        // if (!prevImage.length) errors.prevImage = 'Preview image is required.'
        // if (image1.length === 0 && image1.endsWith('.png,' && image1.endsWith('.jpg') && image1.endsWith('.jpeg'))) errors.image1 = 'Image URL must end in .png, .jpg, or .jpeg'

        // setErrors(errors)

        const imageRegex = /\.(gif|jpe?g|png|bmp|svg)$/i;
        if (prevImage.url === null || prevImage.url === "") {
            err.previewImage = "Preview image is required";
        }
        if (prevImage.url.length > 0 && !imageRegex.test(prevImage.url)) {
            err.previewImage = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if (image1.url.length > 0 && !imageRegex.test(image1.url)) {
            err.image1 = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if (image2.url.length > 0 && !imageRegex.test(image2.url)) {
            err.image2 = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if (image3.url.length > 0 && !imageRegex.test(image3.url)) {
            err.image3 = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if (image4.url.length > 0 && !imageRegex.test(image4.url)) {
            err.image4 = "Image URL must end in .png, .jpg, or .jpeg";
        }


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

        // const newImages = [
        //     {url: prevImage, preview: true},
        //     { url: image1, preview: false },
        //     { url: image2, preview: false },
        //     { url: image3, preview: false },
        //     { url: image4, preview: false }
        // ]

        // const newspot = await dispatch(createSpot(spot, newImages))


        // if (newspot) {
        // history.push(`/spots/${newspot.id}`)
        // }

        if (!!Object.values(err).length) {
            setErrors(err);
        } else {
            const newSpot = await dispatch(createSpot(spot));
            const images = [prevImage, image1, image2, image3, image4];
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                if (image.url) {
                    dispatch(addImage(newSpot.id, image));
                }
            }
            history.push(`/spots/${newSpot.id}`);
        }
    };
   

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create New Spot</h1>
            <h2>Where's your place located?</h2>
            <p>Guests will only get your exact address once they booked a
                reservation.</p>
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
                {/* {errors.country  && <p className="errors">{errors.country}</p>} */}
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
                {/* {errors.address && <p className="errors">{errors.address}</p>} */}
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
                {/* {errors.city && <p className="errors">{errors.city}</p>} */}
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
                {/* {errors.state && <p className="errors">{errors.state}</p>} */}
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
                {/* {errors.latitude && <p className="errors">{errors.latitude}</p>} */}
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
                {/* {errors.longitude && <p className="errors">{errors.longitude}</p>} */}
                <p className="errors">{errors.longitude}</p>
            </div>
            <div className="descriptionbox">
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like
                    fast wifi or parking, and what you love about the neighborhood.</p>
                <input
                    type="text"
                    id="description"
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {/* {errors.description && <p className="errors">{errors.description}</p>} */}
                <p className="errors">{errors.description}</p>
            </div>
            <div className="namebox">
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
                {/* {errors.name && <p className="errors">{errors.name}</p>} */}
                <p className="errors">{errors.name}</p>
            </div>
            <div className="pricebox">
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
               {/* {errors.price && <p className="errors">{errors.price}</p>} */}
                <p className="errors">{errors.price}</p>
            </div>
            <div className="photosboxes">
                <h6>Liven up your spot with photos</h6>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input
                    type="text"
                    id="prevImage"
                    placeholder="Preview Image URL"
                    value={prevImage.url}
                    onChange={(e) => setPrevImage({ url: e.target.value, preview: 1 })}
                />
               {/* {errors.prevImage && <p className="errors">{errors.prevImage}</p>} */}
                <p className="errors">{errors.prevImage}</p>
                <input
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={image1.url}
                    onChange={(e) => setImage1({ url: e.target.value, preview: 0 })}
                />
                {/* {errors.image1 && <p className="errors">{errors.image1}</p>} */}
                <p className="errors">{errors.image1}</p>
                <input
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={image2.url}
                    onChange={(e) => setImage2({ url: e.target.value, preview: 0 })}
                />
                <p className="errors">{errors.image2}</p>
                <input
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={image3.url}
                    onChange={(e) => setImage3({ url: e.target.value, preview: 0 })}
                />
                <p className="errors">{errors.image3}</p>
                <input
                    type="text"
                    id="image"
                    placeholder="Image URL"
                    value={image4.url}
                    onChange={(e) => setImage4({ url: e.target.value, preview: 0 })}
                />
                <p className="errors">{errors.image4}</p>
            </div >
            <div className="thebutt">
                <button 
            type="submit"
            >
            Create Spot
            </button>
            </div>
            
        </form>
    )


}

export default SpotForm