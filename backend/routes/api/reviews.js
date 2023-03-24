const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Review, Spot, SpotImage, ReviewImage, sequelize } = require('../../db/models');

const router = express.Router();


//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {

    // getting all reviews of current user inclduing their User model, Spot model (with spot images)
    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [{model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: Spot, attributes: {exclude: ["createdAt", "updatedAt", "description"],},
                include: [{
                    model: SpotImage,
                    attributes: ['url', 'preview']
                }]},
            {model: ReviewImage, attributes: ['id', 'url']}]
    });

    // creating spotimages by making into an array reassigning url and the deletings spotImages and replacing it with previewImage
    const spotImages = []
    for (let i = 0; i < reviews.length; i++) {
        let review = reviews[i].toJSON()
    
        if (review.Spot.SpotImages.length) {
            for (let j = 0; j < review.Spot.SpotImages.length; j++) {
                if (review.Spot.SpotImages[j].preview) {
                    review.Spot.previewImage = review.Spot.SpotImages[j].url
                }
            }
        }
        if (!review.Spot.SpotImages.length) {
            review.Spot.previewImage = 'No preview image!'
        }
        delete review.Spot.SpotImages;
        spotImages.push(review);
    }

    res.status(200).json({ Reviews: spotImages })
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
   
    //getting the url req body
    const { url } = req.body

    // finding the review
    const review = await Review.findOne({
        where: {
            id: req.params.reviewId
        },
        include: [
            {model: ReviewImage}
        ]
    })
    // checking to see if review exists
    if (!review) {
        return res.status(404).json({
            "message": "Review couldn't be found"
        })
    }

    // checking to see how many images the review has
    if (review.ReviewImages.length >= 10) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
        })
    }
    
    // checking to see if review belongs to user
    if (review.userId !== req.user.id) {
       return res.status(404).json({
            "message": "Invalid"
        });
    }

    // creating new review image
    const newimage = await ReviewImage.create({
        reviewId: req.params.reviewId,
        url: url
    })

    // showing the filtered result of new review image
    let result = {
        id: newimage.id,
        url: newimage.url
    }

    res.status(200).json(result)
});

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {

    // finding the review
    const review = await Review.findByPk(req.params.reviewId)

    // checking to see if review exists
    if (!review) {
        return res.status(404).json({
            "message": "Review couldn't be found"
        })
    }

    // checking to seee if review belongs to user signed in
    if (review.userId !== req.user.id) {
       return res.status(404).json({
            "message": "Invalid"
        });
    }

    // destroying the review
    review.destroy()

    res.status(200).json({
        "message": "Successfully deleted"
    })

})

// Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {
    // body of request
    const { review, stars } = req.body

    // finding the review
    const thereview = await Review.findByPk(req.params.reviewId)

    // checking to see if review exists
    if(!thereview) {
        return res.status(404).json({
            "message": "Review couldn't be found"
        }
    )
    }

    // checking to see if review belongs to user
    if (thereview.userId !== req.user.id) {
        return res.status(404).json({
            "message": "Invalid"
        });
    }

    // editing review
    thereview.review = review
    thereview.stars = stars

    // error object
    let newerrors = {
        message: "Bad Request",
        errors: {}
    }

    // error to check if stars assigned in review are 1 - 5 and review is assigned (both)
    if (!review && (parseInt(stars) < 1 || parseInt(stars) > 5)) {
        newerrors.errors.stars = 'Stars must be an integer from 1 to 5'
        newerrors.errors.review = 'Review text is required'
        return res.status(404).json(newerrors)
    }

    // checking to see if user has assigned a test not just a star review
    if (!review) {
        newerrors.errors.review = 'Review text is required'
        return res.status(400).json(newerrors)
    }

    // checking to see if stars are 1 - 5
    if (!stars || parseInt(stars) < 1 || parseInt(stars) > 5) {
        newerrors.errors.stars = 'Stars must be an integer from 1 to 5'
        return res.status(400).json(newerrors)
    }
    
    // saving edit
    await thereview.save()

    res.status(200).json(thereview)

})




module.exports = router;