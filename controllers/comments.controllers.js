const { fetchCommentById } = require("../models/comments.models")

exports.getCommentsById = (req, res, next) => {
  const {review_id} = req.params;
  return fetchCommentById(review_id).then((comment) => {
    res.status(200).send({comment})
  })
  .catch(err => next(err))
}