import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from '../database/index.js';
import uploadFile from '../middleware/file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const booksRouter = express.Router();

booksRouter.get('/', (req, res) => {
  res.json(Database.books);
});

booksRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const idx = Database.books.findIndex(el => el.id === id);

  if (idx !== -1) {
    res.json(Database.books[idx]);
  } else {
    res.status(404);
    res.json('404 | Книга не найдена!');
  }
});

booksRouter.post('/', uploadFile.single('fileBook'), (req, res) => {
  const {
    title, description, authors, fileCover, fileName,
  } = req.body;

  if (req.file) {
    const newBook = Database.addBook(title, description, authors, fileCover, fileName, req.file.originalname);

    res.status(201);
    res.json(newBook);
  } else {
    res.status(404);
    res.json('404 | Необходимо добавить файл книги!');
  }
});

booksRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const idx = Database.books.findIndex(el => el.id === id);

  if (idx !== -1) {
    for (const key in req.body) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        const element = req.body[key];
        Database.books[idx] = {
          ...Database.books[idx],
          [key]: element,
        };
      }
    }

    res.json(Database.books[idx]);
  } else {
    res.status(404);
    res.json('404 | Книга не найдена!');
  }
});

booksRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const idx = Database.books.findIndex(el => el.id === id);

  if (idx !== -1) {
    Database.books.splice(idx, 1);
    res.json('Книга успешно удалена!');
  } else {
    res.status(404);
    res.json('404 | Книга не найдена!');
  }
});

booksRouter.get('/:id/download', (req, res) => {
  const { id } = req.params;
  const idx = Database.books.findIndex(el => el.id === id);

  if (idx !== -1) {
    res.download(path.join(__dirname, '..', `public/books/${Database.books[idx].fileBook}`), error => {
      if (error) {
        console.log('[ERROR] Download book:');
        console.error(error);
      } else {
        res.json(`Книга ${Database.books[idx].fileBook} успешно загружена!`);
      }
    });
  } else {
    res.status(404);
    res.json('404 | Книга не найдена!');
  }
});

export default booksRouter;
