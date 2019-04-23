'use strict';

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

// Set the view engine for templating
app.set('view-engine', 'ejs');

// Array of groceries for /list route
let list = ['apples', 'pancake', 'butter', 'milk', 'eggs'];

// Array of quantities for /details route
let quantities = [
  {name: 'apples', quantity: 4},
  {name: 'celery', quantity: 1},
  {name: 'butter', quantity: 1},
  {name: 'milk', quantity: 2},
  {name: 'eggs', quantity: 12}
]

// Routes
app.get('/', (request, response) => {
  // Instead of response.sendFile, we will render an ejs page to the front end\
  response.render('index.ejs');

})

app.get('/list', (request, response) => {
  // Render the list view to the page, pass it an object with keys that match the template
  response.render('list.ejs', {
    arrayOfFruit : list,
  });
})

app.get('/quantities', (request, response) => {
  response.render('quantities.ejs', {
    groceries: quantities,
  });
})


app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
