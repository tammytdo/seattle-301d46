'use strict';

// immediate import and configuration
require('dotenv').config();

// global constants
const PORT = process.env.PORT || 3000 ;
const express = require('express');
const cors = require('cors');

// server definition
const app = express();
app.use(cors());

// what the server does

app.get('/location', (request, response) => {
  response.send( searchLatLng(request.query.data) );
})

app.use('*', (request, response) => {
  response.send('my name is nicholas, hire me as a dev');
})

// functions

function searchLatLng(frontEndQuery) {
  /*
{
  "search_query": "seattle",
  "formatted_query": "Seattle, WA, USA",
  "latitude": "47.606210",
  "longitude": "-122.332071"
}
*/
  // take the data from the front end, as the searched for location ('berlin')
  const search_query = frontEndQuery;

  // Go out and get data, tomorrow
  const testData = require('./data/geo.json'); // go get some other data

  const formatted_query = testData.results[0].formatted_address;
  const latitude = testData.results[0].geometry.location.lat;
  const longitude = testData.results[0].geometry.location.lng;

  const responseObject = { search_query, formatted_query, latitude, longitude };

  return responseObject;
}




//server start
app.listen(PORT, ()=> {
  console.log(`app is up on PORT ${PORT}`)
})
