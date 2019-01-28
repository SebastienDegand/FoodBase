const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const MongoClient = require('mongodb').MongoClient
let db = null;

MongoClient.connect('http://mongodb:admin:password06@ds111455.mlab.com:11455/foodbasedb')
  .then(function (database) {
    db = database;
  })
  .catch(function (err) {
    console.log(err)
  })

app.use(express.static(__dirname + '/public'));

app.get('/api/v1/foods', function() {

})

app.listen(port, () => {
  console.log('listening on ' + port)
})