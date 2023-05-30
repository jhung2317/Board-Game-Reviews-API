const express = require('express');
const { getCategories } = require('./controllers/categories.controllers');
const { getCommentsById, postComments, deleteComment } = require('./controllers/comments.controllers');
const { getInstruction } = require('./controllers/instruction.controllers');
const { getReview, getAllReviews, patchReviewVote } = require('./controllers/reviews.controllers');
const app = express();

app.use(express.json());
app.get('/api', getInstruction);
app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReview)
app.get('/api/reviews', getAllReviews)
app.get('/api/reviews/:review_id/comments', getCommentsById)
app.post('/api/reviews/:review_id/comments', postComments)
app.patch('/api/reviews/:review_id', patchReviewVote)
app.delete('/api/comments/:comment_id', deleteComment)

//Error-handling
app.all('*', (req, res) => {
    res.status(400).send({ msg: 'Bad Request.' });
});

app.use((err, req, res, next) => {
  if(err.code === '22P02' ) {
    res.status(400).send({ msg: 'Bad Request.' });
  } else if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else {
    //console.log(err.status,  err.msg)
    res.status(500).send({ msg: 'Internal Server Error' });
    
  }
});

module.exports = app;
