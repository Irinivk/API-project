const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models')

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

//get All Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [{ model: Review, as: 'Reviews', attributes: [] },
        { model: SpotImage, as: 'SpotImages', attributes: [] }],
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.col('SpotImages.url'), 'previewImage']
            ]
        },
        group: ['Spot.id', 'SpotImages.url']  
    })

    res.status(200).json(spots)

});

// Get All Spots owned by current User
router.get('/current', requireAuth, async (req, res) => {
    
    // const spots = await Spot.findAll({
    //     where: {
    //         ownerId: req.user.id
    //     }
    // })

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
    

    res.status(200).json(userSpot)
});

// get details of Spot from spotId
router.get('/:spotId', async (req, res) => {
    // console.log(req.params)
    const spotId = await Spot.findByPk(req.params.spotId, {
        include: [{ model: Review, as: 'Reviews', attributes: [] },
            { model: SpotImage, attributes: ['id', 'url', 'preview'] }, 
            { model: User, as: "Owner", attributes: ['id', 'firstName', 'lastName'] }],
        attributes: {
            include: [
                [sequelize.fn("COUNT", sequelize.col('Reviews.review')), 'numReviews'],
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating']
            ]
        },
        group: ['Spot.id']
    })

    

    if (!spotId) { 
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    // console.log(spotId)
    res.status(200).json(spotId)
});

// create a Spot
router.post('/', requireAuth, validSpots, async (req, res) => {

    const user = req.user
    const { address, city, state, country, lat, lng, name, description, price } = req.body

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
    
    // await newspot.validate()
    await newspot.save()
   
    res.status(201).json(newspot)
})

// add an image to a Spot based on Spots Id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    
    const { url, preview } = req.body

    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }
    
    const newimage = await SpotImage.build({
        spotId: req.params.spotId,
        url, 
        preview
    })

    if (spot.ownerId !== req.user.id) {
        res.status(404).json({
            "message": "Invalid"
        });
    }

    await newimage.save()

    const result = {
        id: newimage.id,
        url: newimage.url,
        preview: newimage.preview
    }

    res.status(200).json(result)
})

// edit a Spot
router.put('/:spotId', requireAuth, validSpots, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    
    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }

    spot.address = address
    spot.city = city,
    spot.state = state,
    spot.country = country
    spot.lat = lat
    spot.lng = lng
    spot.name = name
    spot.description = description
    spot.price = price

    if (spot.ownerId !== req.user.id) {
        res.status(404).json({
            "message": "Invalid"
        });
    }

    await spot.save()

    res.status(200).json(spot)
})

// delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {

    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    })

    if (!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }

    if (spot.ownerId !== req.user.id) {
        res.status(404).json({
            "message": "Invalid"
        });
    }

    await spot.destroy()

    res.status(200).json({
        "message": "Successfully deleted"
    })
})


module.exports = router;