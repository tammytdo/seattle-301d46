'use strict';

// configure environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// application dependencies
const express = require('express');
const cors = require('cors');

// Start the app
const app = express();

app.use(cors());

// My Routes
app.get('/location', (request, response) => {
  response.send(searchToLatLong(request.query.data))
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));


// HELPER FUNCTIONS

// Solution from day 6
function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData);
  location.search_query = query;
  console.log(location);
  return location;
}

function Location(query, res) {
  this.search_query = query;
  this.formatted_query = res.body.results[0].formatted_address;
  this.latitude = res.body.results[0].geometry.location.lat;
  this.longitude = res.body.results[0].geometry.location.lng;
}
