'use strict';

// immediate import and configuration
require('dotenv').config();

// global constants
const PORT = process.env.PORT || 3000 ;
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// server definition
const app = express();
app.use(cors());


app.get('/location', searchLatLng);

// app.get('/weather', (request, response) =>{
//   const finalArrayOfWeather = [];
//   // get the data
//   const weatherJSON = require('./data/darksky.json');

//   const dailyWeather = weatherJSON.daily;
//   const dailyWeatherData = dailyWeather.data;

//   dailyWeatherData.forEach(dayObj => {
//     finalArrayOfWeather.push(new DailyWeather(dayObj));
//   })

//   response.send(finalArrayOfWeather);
// })

app.get('/weather', (request, response) => {
  console.log('from the front end', request.query.data);
  superagent.get(`https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`).then(result => {
    console.log(result.body);
  })
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

function searchLatLng(request, response){
  const frontEndQuery = request.query.data;
  const search_query = frontEndQuery;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${frontEndQuery}&key=${process.env.GEOCODE_API_KEY}`;

  superagent.get(url).then(result => {
    const firstResult = result.body.results[0];

    const formatted_query = firstResult.formatted_address;
    const geometry = firstResult.geometry;
    const location = geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;

    const responseObject = { search_query, formatted_query, latitude, longitude };
    console.log(responseObject);
    response.send(responseObject);
  })
}

//server start
app.listen(PORT, ()=> {
  console.log(`app is up on PORT ${PORT}`)
})



// function searchLatLng(frontEndQuery) {
//   // take the data from the front end, as the searched for location ('berlin')
//   const search_query = frontEndQuery;

//   // Go out and get data, tomorrow
//   const testData = require('./data/geo.json'); // go get some other data
// const formatted_query = testData.results[0].formatted_address;
// const results = testData.results;
// const oneResult = results[0];
// const geometry = oneResult.geometry;
// const location = geometry.location;
// const latitude = location.lat;
// const longitude = location.lng;

// const responseObject = { search_query, formatted_query, latitude, longitude };

// return responseObject;

// }
