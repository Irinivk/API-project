const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models')

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {

    // finding all bookings
    const allbookings = await Booking.findAll({
        where: {
            userId: req.user.id
        }
    })

    // putting all bookings to array
    const bookn = []

    for (let i = 0; i < allbookings.length; i++) {
       bk = allbookings[i].toJSON()
       bookn.push(bk)
    }

    // finding all spots of bookings and images of spots and putting them into the bookings
    for ( let booking of bookn) {
        const spot = await Spot.findByPk(booking.spotId, {
            attributes: {
                exclude: ["createdAt", "updatedAt", "description"]
            }
        })

        booking['Spot'] = spot

        // finding image
        const image = await SpotImage.findOne({
            where: {
                preview: true,
                spotId: spot.id
            }
        });
        
        // reassigning spotImage
        if (image) {
             booking.Spot.dataValues['previewImage'] = image.url; 
        }
        if (!image) {
            booking.Spot.dataValues['previewImage'] = "No spotImages for this spot";
        }
       
    }
    res.status(200).json({Bookings: bookn})
})

//Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) =>{

    //finding the booking based on bookingId
    const thebooking = await Booking.findByPk(req.params.bookingId)

    // checking to see if booking exists
    if (!thebooking) {
        res.status(404).json({
            "message": "Booking couldn't be found"
        })
    }

    // you must own the booking
    if (thebooking.userId !== req.user.id) {
        return res.status(404).json({
            "message": "User must own the Booking!"
        })
    }

    const thisdate = new Date().toDateString()
    const td = new Date(thisdate).getTime()

    const thisbk = thebooking.endDate.getTime()

    // checking to see if the current booking has passed already
    if (td > thisbk) {
        return res.status(403).json({
            "message": "Past bookings can't be modified"
        })
    }

    // grabbing body or req
    const { startDate, endDate } = req.body

    // bookings dates
    const EDDATE = new Date(endDate).toDateString()
    const el = new Date(EDDATE)
    const newendtime = el.getTime()


    const STDATE = new Date(startDate).toDateString()
    const al = new Date(STDATE)
    const newstarttime = al.getTime()


    // checking to see if bookings end date is equal or smaller the start date
    if (newendtime <= newstarttime) {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    };

    // grabbing all bookings of user
    const allbookings = await Booking.findAll({
        where: {
            userId: req.user.id
        }
    })

    // pushing all bookings to an array to compare dates
    const allbk = []
    for (let i = 0; i < allbookings.length; i++) {
        allbk.push(allbookings[i].toJSON())
    }

    // error object
    let err = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {}
    }

    // checking to see if bookings date conflicts with other bookings dates. 
    for (let booking of allbk) {
        // console.log(booking)

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

    // editing the bookings
    thestartdate = new Date(startDate)
    theenddate = new Date(endDate)
    thebooking.startDate = thestartdate
    thebooking.endDate = theenddate

    thebooking.save()

    res.status(200).json(thebooking)

})

// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const thebooking = await Booking.findByPk(req.params.bookingId)

    // booking coundn't be found
    if (!thebooking) {
        return res.status(404).json({
            "message": "Booking couldn't be found"
        })
    }

    // finding the booking that belongs to spot
    const thespot = await Spot.findOne({
        where: {
            id: thebooking.spotId
        }
    })

    // either booking or spot must belong to you
    if ((thebooking.userId !== req.user.id) && (thespot.ownerId !== req.user.id)) {
        return res.status(404).json({
            "message": "User must own the Booking or the Spot!"
        })
    }

    // today's date
    const thisdate = new Date().toDateString()
    const td = new Date(thisdate).getTime()
    console.log(thisdate)
    
    // if the bookings start date is smaller the todays date than invalid

    // boookings start date
    const bookingsdate = thebooking.startDate
    const bd = bookingsdate.getTime()
    
    // checks if bookings start date has started, if it has then you can''t delete the booking
    if (bd < td) {
        return res.status(403).json({
            "message": "Bookings that have been started can't be deleted"
        })
    }

    // destroying the booking
    await thebooking.destroy()

    res.status(200).json({
        "message": "Successfully deleted"
    })

})

module.exports = router;