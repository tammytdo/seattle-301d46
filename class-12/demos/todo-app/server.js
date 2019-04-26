'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg');
// const superagent = require('superagent');

const app = express();

// make a pg client that will talk to my database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

const PORT = process.env.PORT || 3000;

// adds a body property to 'request' and stores the form data there
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view-engine', 'ejs');


app.get('/', showTasks)

app.get('/add-task', showTaskForm);

app.post('/add-task', addTask);


app.get('/task/:task_id/:morganaquestion/:chris', getTask);

app.listen(PORT, () => {console.log(`app us running on port ${PORT}`)});

function showTasks(request, response) {
  client.query('SELECT * FROM tasks;').then(result => {
    response.render('index.ejs', {data: result.rows});

  })

  //call the response.render method on an ejs file to turn it into html and give it to the front end
}

function showTaskForm (request, response){
  // response.send('about to get formy');
  response.render('pages/add-view.ejs');
}

function addTask(request, response){
  client.query('INSERT INTO tasks (title, description, category, contact, status) VALUES ($1, $2, $3, $4, $5)', Object.values(request.body))

  // dummyData.push(request.body);
  // console.log(dummyData);

  //instead of rerendering and copying code (not dry);
  // I will force chrome to redirect to my home route
  response.redirect('/')
}

function getTask(request, response){
  console.log(request.params);
}
