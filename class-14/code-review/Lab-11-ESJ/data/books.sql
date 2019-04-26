CREATE DATABASE book_app_database;

\c book_app_database;

DROP TABLE IF EXISTS book;

CREATE TABLE book(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  description TEXT,
  image VARCHAR(255)
);



INSERT INTO book (title, author, description, image) VALUES ('The best book', 'Anonus', 'Best book ever', 'https://mtgcardsmith.com/view/complete/full/2018/3/21/1521651595397592.png');

INSERT INTO book (title, author, description, image) VALUES ('Decent book', 'Guy', 'Most Decentest Book ever', 'https://i.harperapps.com/covers/9780061894558/y648.jpg');

INSERT INTO book (title, author, description, image) VALUES ('Flavor Town', 'Present Day', 'A slammin trip to flavor town', 'https://mtgcardsmith.com/view/complete/full/2018/3/21/1521651595397592.png');

INSERT INTO book (title, author, description, image) VALUES ('The Bible', 'God', 'Gods Diary', 'https://i.harperapps.com/covers/9780061894558/y648.jpg');
