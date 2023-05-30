const { fetchCommentById, createComment, removeComment } = require("../models/comments.models")

exports.getCommentsById = (req, res, next) => {
  const {review_id} = req.params;
  return fetchCommentById(review_id).then((comments) => {
    res.status(200).send({comments})
  })
  .catch(err => next(err))
}

exports.postComments = (req, res, next) => {
  const {review_id} = req.params;
  const newComment = req.body;
  return createComment(review_id, newComment).then((postedComments) => {
    res.status(201).send({postedComments})
  })
  .catch(err => {
    console.log(err)
    return next(err)
  })
}

exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params;
  return removeComment(comment_id).then((comments) => {
    res.status(204).send()
  })
  .catch(err => next(err))
}