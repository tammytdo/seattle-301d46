'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

const app = express();
app.use(express.static('./public')); //for the purposes of our site, public is the root folder
app.use(express.urlencoded({ extended: true }));
app.set('view-engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));
client.connect();


//===============================
// SQL
//===============================

const SQL = {};
SQL.getAll = 'SELECT * FROM saved_books;';
SQL.getById = 'SELECT * FROM saved_books WHERE id=$1;';

//===============================
// Constructor
//===============================

function Book(book) {
  this.title = book.volumeInfo.title || 'Title not found';
  this.authors = book.volumeInfo.authors || 'Could not find Author';
  this.description = book.volumeInfo.description || 'No description given.';
  this.photo = book.volumeInfo.imageLinks ?(book.volumeInfo.imageLinks.thumbnail.substring(0, 4) + 's' + book.volumeInfo.imageLinks.thumbnail.slice(4, book.volumeInfo.imageLinks.thumbnail.length)) : 'doesnotexist.jpg';
}

//===============================
//===============================

function handleError (error, response) {
  response.render('pages/error.ejs', {status:500, message:'Something has gone wrong!'});
  console.log('Ooops.');
  console.error(error);
}

//render homepage on load, at this route
app.get('/', (request, response) => {
  client.query(SQL.getAll).then(result => {
    //first parameter indicates where content will be rendered, second parameter indicates retrived data from table.
    response.render('pages/index.ejs', { savedBooksArr: result.rows });
  }).catch(error => handleError(error, response));
});

app.get('/books/:id', (request, response) => {
  const selected = parseInt(request.params.id);
  client.query(SQL.getById, [selected]).then(result => {
    response.render('pages/books/detail.ejs', {showBook: result.rows[0]});
  })
})

//render this form at this route
app.get('/new_search', (request, response) => {
  response.render('pages/searches/new.ejs');
});

app.post('/searches', (request, response) => {
  const query = request.body.search;
  console.log(query);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
  superagent.get(url).then(result => {
    const bookResults = result.body.items.slice(0, 10);
    // console.log((bookResults[0].volumeInfo.imageLinks.thumbnail.substring(0, 4) + 's' + bookResults[0].volumeInfo.imageLinks.thumbnail.slice(4, bookResults[0].volumeInfo.imageLinks.thumbnail.length)));

    //bookArray puts content in format front end can use
    const bookArray = bookResults.map(indBook => {
      return new Book(indBook);
    });
    response.render('pages/searches/show.ejs', { bookArray: bookArray });
    // response.send(bookArray);
  }).catch(error => handleError(error, response));
});

app.post('/save_to_library', (request, response) =>{
  //save the book
  // let a = request.body
  const {title, author, image_url, description, isbn, bookshelf } = request.body;

  const sql = `INSERT INTO saved_books (title, author, description, image_url, isbn, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);`

  client.query(sql, [title, author, description, image_url, isbn, bookshelf])

  // INSERT INTO saved_books (title, author, description, image_url, isbn, bookshelf) VALUES ('I am a Book', 'Anon', 'Best book ever', 'https://cdn.discover-the-world.com/app/uploads/2018/05/antarctica-wildlife-adelie-penguins-icehopping-istock-800x600-c-default.jpg', '1234567891234', 'Coool Boooks');

  response.redirect('/');
})

// below test renders page
app.get('/test', (request, response) => {
  response.render('pages/index.ejs');
});

//===============================

app.listen(PORT, () => { console.log(`App is up on PORT ${PORT}`) });
