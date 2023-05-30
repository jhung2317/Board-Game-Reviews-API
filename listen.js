const app = require('./app');
const { port = 9900 } = process.env;

app.listen(port, () => {console.log(`listening on ${port}.`)});