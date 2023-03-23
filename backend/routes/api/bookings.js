const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models')

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {

    const allbookings = await Booking.findAll({
        where: {
            userId: req.user.id
        }
    })

    const bookn = []

    for (let i = 0; i < allbookings.length; i++) {
       bk = allbookings[i].toJSON()
       bookn.push(bk)
    }

    for ( let booking of bookn) {
        const spot = await Spot.findByPk(booking.spotId, {
            attributes: {
                exclude: ["createdAt", "updatedAt", "description"]
            }
        })

        booking['Spot'] = spot

        const image = await SpotImage.findOne({
            where: {
                preview: true,
                spotId: spot.id
            }
        });

        booking['Spot'].previewImage = image.url;
    }
 
   console.log(allbookings)
    res.status(200).json({Bookings: bookn})
})

//Get all Bookings for a Spot based on the Spot's id



module.exports = router;