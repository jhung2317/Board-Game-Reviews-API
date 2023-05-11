const express = require('express');
const { getCategories } = require('./controllers/categories.controllers');
const { getInstruction } = require('./controllers/instruction.controllers');
const { getReview } = require('./controllers/reviews.controllers');
const app = express();

app.get('/api', getInstruction);
app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReview)

//Error-handling
app.all('*', (req, res) => {
    res.status(404).send({ msg: 'Bad Request.' });
});

// app.use((err, req, res, next) => {
//   if (err.code === '22P02') {
//     res.status(400).send({ msg: 'Invalid input' });
//   } else next(err);
// });

app.use((err, req, res, next) => {
  console.log(err.msg);
  if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else {
    res.status(500).send({ msg: 'Internal Server Error' });

  }
});

module.exports = app;
