const { fetchCommentById } = require("../models/comments.models")

exports.getCommentsById = (req, res, next) => {
  const {review_id} = req.params;
  return fetchCommentById(review_id).then((comments) => {
    res.status(200).send({comments})
  })
  .catch(err => next(err))
}