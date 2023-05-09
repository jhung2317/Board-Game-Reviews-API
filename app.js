const express = require('express');
const { getCategories } = require('./controllers/categories.controllers');
const app = express();


app.get('/api', (request, response) => response.send({msg: 'all ok'}));
app.use('/api/categories', getCategories)

//Error-handling
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  else if (err.code === '22P02') {
    res.status(400).send({ msg: err.message || 'Bad Request' });
  } else {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

module.exports = app;
