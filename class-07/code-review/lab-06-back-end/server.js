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
//the route
//request = data from query. example, from a front end query
//can test in localhost:3000/location to verify
app.get('/location', (request, response) => {
  if(request.query.data !== 'lynnwood'){
    response.status(500).send('yo, i only got the lynwood data')
  }
  response.send( searchLatLng(request.query.data) );
  // response.send({
  //   'search_query': 'seattle',
  //   'formatted_query': 'Seattle, WA, USA',
  //   'latitude': '47.606210',
  //   'longitude': '-122.332071'
  // })
})

app.get('/weather', (request, response) =>{
  const finalArrayOfWeather = [];
  // get the data
  const weatherJSON = require('./data/darksky.json');

  const dailyWeather = weatherJSON.daily;
  const dailyWeatherData = dailyWeather.data;

  dailyWeatherData.forEach(dayObj => {
    finalArrayOfWeather.push(new DailyWeather(dayObj));
  })

  response.send(finalArrayOfWeather);
})

app.use('*', (request, response) => {
  response.send('Our server runs.');
})


// ==============================================
// Helper Functions
// ==============================================

function DailyWeather(rawDayObj){


  this.forecast = rawDayObj.summary;
  this.time = new Date (rawDayObj.time * 1000).toString().slice(0, 15);
}

function searchLatLng(frontEndQuery) {
  /*
  'search_query': 'seattle',
  //   'formatted_query': 'Seattle, WA, USA',
  //   'latitude': '47.606210',
  //   'longitude': '-122.332071'
  */
  // take the data from the front end, as the searched for location ('berlin')
  const search_query = frontEndQuery;

  // Go out and get data, tomorrow
  const testData = require('./data/geo.json'); // go get some other data

  const formatted_query = testData.results[0].formatted_address;
  const results = testData.results;
  const oneResult = results[0];
  const geometry = oneResult.geometry;
  const location = geometry.location;
  const latitude = location.lat;
  const longitude = location.lng;

  const responseObject = { search_query, formatted_query, latitude, longitude };

  return responseObject;

}

//server start
app.listen(PORT, ()=> {
  console.log(`app is up on PORT ${PORT}`)
})
