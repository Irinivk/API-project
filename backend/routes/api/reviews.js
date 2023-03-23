const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Review, Spot, SpotImage, ReviewImage, sequelize } = require('../../db/models');

const router = express.Router();


//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {

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
   
    const { url } = req.body

    const review = await Review.findOne({
        where: {
            id: req.params.reviewId
        },
        include: [
            {model: ReviewImage}
        ]
    })

    if (!review) {
        res.status(404).json({
            "message": "Review couldn't be found"
        })
    }

    if (review.ReviewImages.length >= 10) {
        res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
        })
    }
    
    if (review.userId !== req.user.id) {
        res.status(404).json({
            "message": "Invalid"
        });
    }

    const newimage = await ReviewImage.create({
        reviewId: req.params.reviewId,
        url: url
    })


    let result = {
        id: newimage.id,
        url: newimage.url
    }

    console.log(review.ReviewImages)
    res.status(200).json(result)
});

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {

    const review = await Review.findByPk(req.params.reviewId)

    if (!review) {
        res.status(404).json({
            "message": "Review couldn't be found"
        })
    }

    if (review.userId !== req.user.id) {
        res.status(404).json({
            "message": "Invalid"
        });
    }

    review.destroy()

    res.status(200).json({
        "message": "Successfully deleted"
    })

})

// Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {
    const { review, stars } = req.body

   

    const thereview = await Review.findByPk(req.params.reviewId)

    if(!thereview) {
        res.status(404).json({
            "message": "Review couldn't be found"
        }
    )
    }
    if (thereview.userId !== req.user.id) {
        res.status(404).json({
            "message": "Invalid"
        });
    }
    thereview.review = review
    thereview.stars = stars

    
    let newerrors = {
        message: "Bad Request",
        errors: {}
    }

    if (!review && (parseInt(stars) < 1 || parseInt(stars) > 5)) {
        newerrors.errors.stars = 'Stars must be an integer from 1 to 5'
        newerrors.errors.review = 'Review text is required'
        res.status(404).json(newerrors)
    }

    if (!review) {
        newerrors.errors.review = 'Review text is required'
        res.status(400).json(newerrors)
    }

    if (!stars || parseInt(stars) < 1 || parseInt(stars) > 5) {
        newerrors.errors.stars = 'Stars must be an integer from 1 to 5'
        res.status(400).json(newerrors)
    }

    await thereview.save()

    res.status(200).json(thereview)

})




module.exports = router;