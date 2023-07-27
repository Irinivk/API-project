const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

const validSpots = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isDecimal()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({max: 50})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
]

const allspotsquery = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1'),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
    check("minPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    handleValidationErrors
];

//get All Spots
router.get('/', allspotsquery, async (req, res) => {
    // getting req.body
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;



    //// WASN'T WORKING FIXED ////////

    // allspotquery wasn't working so this is BY HAND
    if (Number.isNaN(maxLat)) {
        const err = new Error("Bad Request")
        err.errors = "Maximum latitude is invalid"
        err.status = 400;
        next(err)
    }
    if (Number.isNaN(minLat)) {
        const err = new Error("Bad Request")
        err.errors = "Minimum latitude is invalid"
        err.status = 400;
        next(err)
    }
    if (Number.isNaN(maxLng)) {
        const err = new Error("Bad Request")
        err.errors = "Maximum longitude is invalid"
        err.status = 400;
        next(err)
    }
    if (Number.isNaN(minLng)) {
        const err = new Error("Bad Request")
        err.errors = "Minimum longitude is invalid"
        err.status = 400;
        next(err)
    }




    /// page and size of pagination 
    page = parseInt(page);
    size = parseInt(size)

    // default page and size
    if (Number.isNaN(page) || !page  || page > 10) page = 1;
    if (Number.isNaN(size) || !size || size > 20) size = 20;
    const offset = size * (page - 1);

    const pagination = {};
    if (page >= 1 && size >= 1) {
        pagination.limit = size;
        pagination.offset = offset;
    }

    // min max error handling and where clause 
    let where = {};
    if (minLat) {
        where.lat = { [Op.gte]: minLat }
    }
    if (maxLat) {
        where.lat = { [Op.lte]: maxLat }
    }
    if (minLng) {
        where.lng = { [Op.gte]: minLng }
    }
    if (maxLng) {
        where.lng = { [Op.lte]: maxLng }
    }
    if (minPrice) {
        where.price = { [Op.gte]: minPrice }
    }
    if (maxPrice) {
        where.price = { [Op.lte]: maxPrice }
    }


    // find all spots
    const spots = await Spot.findAll({
        where,
        include: [
            { model: SpotImage },
            { model: Review }
        ],
        ...pagination
    });

    // array of spots
    const spotsList = []
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })  

    // console.log(spotsList.SpotImages)

    /////// ERROR ///////

    // images and reviews of spots
    spotsList.forEach(spot => {
        
        if (spot.SpotImages[0].preview === true) spot.previewImage = spot.SpotImages[0].url
        if (spot.SpotImages[0].preview === false) spot.previewImage = 'no preview image found'
        console.log(spot.SpotImages)
        // spot.SpotImages.forEach(img => {
        //     if (img.preview === true) spot.previewImage = img.url
        //     else spot.previewImage = 'no preview image found'
        // })
        if (!spot.SpotImages.length) spot.previewImage = 'no preview image found'
        delete spot.SpotImages

        let count = 0;
        let sum = 0;
        spot.Reviews.forEach(review => {
            count++;
            sum += review.stars;
        })
        let avg = sum / count;
        spot.avgRating = avg;
        if (!spot.Reviews.length) spot.avgRating = 'no average rating'
        delete spot.Reviews
    })

    res.status(200).json({ Spots: spotsList, page, size })

});

// Get All Spots owned by current User
router.get('/current', requireAuth, async (req, res) => {
   
    // finding all spots that are owned by user and reassiging spotImage with previewImage, and including review of spots
    const userSpot = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [{ model: Review, as: 'Reviews', attributes: [] },
        {model: SpotImage, as: 'SpotImages', attributes: [] }],
        attributes: { include: [ 
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.col('SpotImages.url'), 'previewImage'] 
            ]},

        group: ['Spot.id', 'SpotImages.url']
    })
    

    res.status(200).json({Spots: userSpot})
});

// get details of Spot from spotId
router.get('/:spotId', async (req, res) => {

    // finding the spot and including user that owns the spot
    const spotId = await Spot.findOne( {
        where: {
            id: req.params.spotId
        },
        include: [{ model: SpotImage, attributes: ['id', 'url', 'preview'] }, 
            { model: User, as: "Owner", attributes: ['id', 'firstName', 'lastName'] }]
    })

    // checking to see if spot exists
     if (!spotId) { 
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    // find the review for spot and making it avg
    const spotReviews = await Review.findOne({
        attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"]],
        where: {
            spotId: req.params.spotId
        }
    });

    // lazy loading it cauz of error
    const reviews = await spotId.getReviews();

    // total number of reviews for that spot so the user can see
    const totalReviews = reviews.length;

    // reassiging
    spotId.dataValues['numReviews'] = totalReviews; 
    spotId.dataValues['avgStarRating'] = spotReviews.dataValues.avgStarRating

    res.status(200).json(spotId)
});

// create a Spot
router.post('/', requireAuth, validSpots, async (req, res) => {
    // grabbing user and req body
    const user = req.user
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    // buidling the spot
    const newspot = await Spot.build({
        ownerId: user.id,
        address, 
        city, 
        state, 
        country, 
        lat, 
        lng, 
        name, 
        description, 
        price 
    })
    
    // saving the spot
    await newspot.save()
   
    res.status(201).json(newspot)
})

// add an image to a Spot based on Spots Id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    // grabbing req body
    const { url, preview } = req.body

    // finding spot by spotId
    const spot = await Spot.findByPk(req.params.spotId)

    // checking to see if spot exists
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }
    
    // building the new image for spot
    const newimage = await SpotImage.build({
        spotId: req.params.spotId,
        url, 
        preview
    })

    // checking to see if the spot belongs to the user signed in
    if (spot.ownerId !== req.user.id) {
        return res.status(404).json({
            "message": "Invalid"
        });
    }

    // saving the new image
    await newimage.save()

    // filtering response results 
    const result = {
        id: newimage.id,
        url: newimage.url,
        preview: newimage.preview
    }

    res.status(200).json(result)
})

// edit a Spot
router.put('/:spotId', requireAuth, validSpots, async (req, res) => {
    // grabbing re body
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    
    // finding the spot that needs editing
    const spot = await Spot.findByPk(req.params.spotId)

    // checking to see if spot exists
    if(!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }

    // reassiging spot values
    spot.address = address
    spot.city = city,
    spot.state = state,
    spot.country = country
    spot.lat = lat
    spot.lng = lng
    spot.name = name
    spot.description = description
    spot.price = price

    // checking to see if the user signed it owns the spot
    if (spot.ownerId !== req.user.id) {
        return res.status(404).json({
            "message": "Invalid"
        });
    }

    // if they do we save the new edits done
    await spot.save()

    res.status(200).json(spot)
})

// delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {

    // finding the spot to delete
    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    })
i
    // checking to see if spot exists
    if (!spot) {
       return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }

    // checking to see if user signed in owns the spot
    if (spot.ownerId !== req.user.id) {
       return res.status(404).json({
            "message": "Invalid"
        });
    }

    // deleting the spot
    await spot.destroy()

    res.status(200).json({
        "message": "Successfully deleted"
    })
})

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {

    // grabbing the spot
    const spot = await Spot.findByPk(req.params.spotId)

    // checking to see if spot exists
    if (!spot) {
       return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    } 

    // finding all reviews of spot and including users
    const review = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [{model: User, attributes: ['id', 'firstName', 'lastName']},
            { model: ReviewImage, attributes: ['id', 'url'] }]
    })

    // checking to see if review exists
    if (!review) {
       return res.status(404).json({
            "message": "Reviews couldn't be found"
        })
    }

    res.status(200).json({Reviews: review})
})


// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    // grabbing req body
    const { review, stars } = req.body

    // finding spot
    const spot = await Spot.findByPk(req.params.spotId)

    // checking to see if spot exists
    if (!spot) {
       return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }   

    // error object
    let newerrors = {
        message: "Bad Request",
        errors: {}
    }
    // checking to see if starts 1 - 5 and if review exists
    if (!review && (parseInt(stars) < 1 || parseInt(stars) > 5)) {
        newerrors.errors.stars = 'Stars must be an integer from 1 to 5'
        newerrors.errors.review = 'Review text is required'
        return res.status(404).json(newerrors)
    } 
    // checking to see if review exists
    if (!review) {
        newerrors.errors.review = 'Review text is required'
        return res.status(400).json(newerrors)
    } 
    // checking to see if stars exists and is 1 - 5
    if (!stars || parseInt(stars) < 1 || parseInt(stars) > 5) {
        newerrors.errors.stars = 'Stars must be an integer from 1 to 5'
        return res.status(400).json(newerrors)
    }

    // finding the review
    const theReview = await Review.findOne({
        where: {
            spotId: req.params.spotId,
            userId: req.user.id
        }
    });

    // checking to see if the user has already written a review for this spot
    if (theReview) {
       return res.status(403).json({
            "message": "User already has a review for this spot"
        })
        
    }
    
    // creating the review 
    const newReview = await Review.create({
        id: Review.id,
        spotId: spot.id,
        userId: req.user.id,
        review,
        stars
    })

    res.status(201).json(newReview)
    
})

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    // finding spot
    const spotss = await Spot.findByPk(req.params.spotId)

    // checking to see if spot exists
    if (!spotss) {
       return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }
    // all the bookings that don't belong to user
    const NOTownerOFbooking = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes: ["spotId", "startDate", "endDate"]
    })
   
    // all of the bookings that DO belong to user
    const ownerOFbooking = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [{ model: User, attributes: ['id', "firstName", "lastName"]}]
    })

    // results if bookings dont belong
    if(spotss.dataValues.ownerId !== req.user.id) {
       return res.status(200).json({
           Bookings: NOTownerOFbooking})
    }
    // results if bookings DO belong
    if (spotss.dataValues.ownerId === req.user.id) {
       return res.status(200).json({
           Bookings: ownerOFbooking
        })
    }

})

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    // getting req body
    const { startDate, endDate } = req.body 

    // finding spot
    const thespot = await Spot.findByPk(req.params.spotId)

    // checking to see if spot exists
    if(!thespot) {
       return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }
    
    // checking to see if spot belongs to user signed in
    if (thespot.ownerId === req.user.id) {
       return res.status(404).json({
            "message": "User must not own Spot!"
        })
    }

    // getting the date of booking you want to make
    const EDDATE = new Date(endDate).toDateString()
    const el = new Date(EDDATE)
    const newendtime = el.getTime()


    const STDATE = new Date(startDate).toDateString()
    const al = new Date(STDATE)
    const newstarttime = al.getTime()
    
    // checking to see if the endDate of new booking is after startDtae
    if (newendtime <= newstarttime) {
       return res.status(400).json({
            "message": "Bad Request", 
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    };

    // getting all bookings to check if no other booking have beeing assigned those dates
    const allbookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        }
    })

    // array of all bookings
    const allbk = []
    for (let i = 0; i < allbookings.length; i++) {
        allbk.push(allbookings[i].toJSON())
    }

    // error object
    let err = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {}
    }

    // comparing dates to new booking
    for (let booking of allbk) {

        const elst = booking.startDate.getTime()
        const aled = booking.endDate.getTime()

        if ((newstarttime >= elst && newstarttime <= newendtime) && (newendtime >= elst && newendtime <= aled)) {
            err.errors.startDate = "Start date conflicts with an existing booking"
            err.errors.endDate = "End date conflicts with an existing booking"
            return res.status(403).json(err);
        }

        if (newstarttime >= elst && newstarttime <= aled) {
            err.errors.startDate = "Start date conflicts with an existing booking"
            return res.status(403).json(err);
        }

        if (newendtime >= elst && newendtime <= aled) {
            err.errors.endDate = "End date conflicts with an existing booking"
            return res.status(403).json(err);
        }
    }

    // creating new booking
    const newBooking = await Booking.create({
        spotId: req.params.spotId,
        userId: req.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
    })

    res.status(200).json(newBooking)
})



module.exports = router;
