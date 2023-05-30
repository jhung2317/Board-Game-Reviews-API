const { selectReviewById, fetchAllReviews, editReviewVote } = require("../models/reviews.models")

exports.getReview = (req, res, next) => {
    const {review_id} = req.params;
    return selectReviewById(review_id).then((review) => {
        res.status(200).send({ review })
    })

    .catch(err => next(err));
}

exports.getAllReviews = (req, res, next) => {
  return fetchAllReviews().then((reviews) => {
    res.status(200).send({ Review: reviews })
  })
  .catch(err => next(err));
}

exports.patchReviewVote = (req, res, next) => {
  const {review_id} = req.params;
  const reviewVote = req.body;
  //console.log(review_id, reviewVote)

  return editReviewVote(review_id, reviewVote.inc_votes).then((updatedReview) => {
    res.status(200).send({review: updatedReview})
  })
  .catch(err => next(err));
}