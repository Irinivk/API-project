const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models')

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    // finding the SpotImage
    const spotIm = await SpotImage.findOne({
        where: {
            id: req.params.imageId
        }
    })
    
    // checking to see if SpotImage exists
    if (!spotIm) {
        return res.status(404).json({
            "message": "Spot Image couldn't be found"
        })
    }

    // find spot that belongs to the SpotImage
    const thespot = await Spot.findOne({
        where: {
            id: spotIm.dataValues.spotId
        }
    })

    // checking if the spot belongs to logged in user
    if (thespot.ownerId !== req.user.id) {
        return res.status(404).json({
            "message": "User must own the Spot that goes with the image!"
        })
    }

    // destoring SpotImage
    await spotIm.destroy()

    res.status(200).json({
        "message": "Successfully deleted"
    })
})


module.exports = router;