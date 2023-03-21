const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models')

const router = express.Router();

const validSpots = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
]

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

})


router.get('/current', requireAuth, async (req, res) => {
    
    const userSpot = await Spot.findAll({
        where: {
            ownerid: req.user.id
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
})

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
    })

    if (!spotId.id) { 
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    // console.log(spotId)
    res.status(200).json(spotId)
})


module.exports = router;