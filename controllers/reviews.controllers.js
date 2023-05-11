const { selectReviewById } = require("../models/reviews.models")


exports.getReview = (req, res, next) => {
    const {review_id} = req.params;
    return selectReviewById(review_id).then((review) => {
        res.status(200).send({ review })
    })
    .catch(next)
}