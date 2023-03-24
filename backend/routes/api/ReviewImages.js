const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models')

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    // finding the ReviewImage
    const reviewIm = await ReviewImage.findOne({
        where: {
            id: req.params.imageId
        }
    })

    // checking to see if ReviewImage exists
    if (!reviewIm) {
        return res.status(404).json({
            "message": "Review Image couldn't be found"
        })
    }

    // find review that belongs to the ReviewImage
    const thereview = await Review.findOne({
        where: {
            id: reviewIm.dataValues.reviewId
        }
    })

    // checking if the Review belongs to logged in user
    if (thereview.userId !== req.user.id) {
        return res.status(404).json({
            "message": "User must own the Review that goes with the image!"
        })
    }

    // destoring ReviewImage
    await reviewIm.destroy()

    res.status(200).json({
        "message": "Successfully deleted"
    })

})


module.exports = router;
