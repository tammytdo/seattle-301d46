DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR(255),
  category VARCHAR(255),
  contact VARCHAR(255),
  status VARCHAR(255)
);

INSERT INTO tasks (title, description, category, contact, status) VALUES ('love ginger', 'snuggles', 'lovin', 'ginger', 'complete');