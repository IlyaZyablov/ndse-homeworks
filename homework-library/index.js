import express from 'express';

import Book from './classes/Book.js';

const app = express();

app.use(express.json());

const booksDatabase = [
  new Book('Игра престолов', 'роман в жанре фэнтези', 'Джордж Р.Р. Мартин', 'серая', 'A_Game_of_Thrones.pdf'),
  new Book('Преступление и наказание', 'социально-психологический роман', 'Ф.М. Достоевский', 'белая', 'Crime_&_Punishment.pdf'),
];

app.get('/api/user/login', (req, res) => {
  res.status(201);
  res.json({ id: 1, mail: 'test@mail.ru' });
});

app.get('/api/books', (req, res) => {
  res.json(booksDatabase);
});

app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const idx = booksDatabase.findIndex(el => el.id === id);

  if (idx !== -1) {
    res.json(booksDatabase[idx]);
  } else {
    res.status(404);
    res.json('404 | Книга не найдена!');
  }
});

app.post('/api/books/', (req, res) => {
  const {
    title, description, authors, fileCover, fileName,
  } = req.body;

  const newBook = new Book(title, description, authors, fileCover, fileName);
  booksDatabase.push(newBook);

  res.status(201);
  res.json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const idx = booksDatabase.findIndex(el => el.id === id);

  if (idx !== -1) {
    for (const key in req.body) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        const element = req.body[key];
        booksDatabase[idx] = {
          ...booksDatabase[idx],
          [key]: element,
        };
      }
    }

    res.json(booksDatabase[idx]);
  } else {
    res.status(404);
    res.json('404 | Книга не найдена!');
  }
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const idx = booksDatabase.findIndex(el => el.id === id);

  if (idx !== -1) {
    booksDatabase.splice(idx, 1);
    res.json('Книга успешно удалена!');
  } else {
    res.status(404);
    res.json('404 | Книга не найдена!');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
