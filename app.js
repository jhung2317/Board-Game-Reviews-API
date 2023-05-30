const express = require('express');
const { getCategories } = require('./controllers/categories.controllers');
const { getCommentsById } = require('./controllers/comments.controllers');
const { getInstruction } = require('./controllers/instruction.controllers');
const { getReview, getAllReviews } = require('./controllers/reviews.controllers');
const { handleServerErrors, handleCustomErrors, handlePsqlErrors } = require('./db/errors/errors');
const app = express();

app.get('/api', getInstruction);
app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReview)
app.get('/api/reviews', getAllReviews)
app.get('/api/reviews/:review_id/comments', getCommentsById)


//Error-handling
app.all('*', (req, res) => {
    res.status(400).send({ msg: 'Bad Request.' });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
