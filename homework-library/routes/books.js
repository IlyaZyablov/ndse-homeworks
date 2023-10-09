import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from '../database/index.js';
import uploadFile from '../middleware/file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const booksRouter = express.Router();

booksRouter.get('/', (req, res) => {
  res.render('books/index', {
    title: 'Список книг',
    books: Database.books,
  });
});

booksRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const idx = Database.books.findIndex(el => el.id === id);

  if (idx !== -1) {
    res.render('books/view', {
      title: Database.books[idx].title,
      book: Database.books[idx],
    });
  } else {
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Книга не найдена!',
    });
  }
});

booksRouter.post('/', uploadFile.single('fileBook'), (req, res) => {
  const {
    title, description, authors, fileCover,
  } = req.body;

  if (req.file) {
    Database.addBook(title, description, authors, fileCover, req.file.originalname, req.file.filename);

    res.redirect('/books');
  } else {
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Необходимо добавить файл книги!',
    });
  }
});

booksRouter.get('/update/:id', (req, res) => {
  const { id } = req.params;
  const idx = Database.books.findIndex(el => el.id === id);

  if (idx !== -1) {
    res.render('books/update', {
      title: Database.books[idx].title,
      book: Database.books[idx],
    });
  } else {
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Книга не найдена!',
    });
  }
});

booksRouter.post('/update/:id', (req, res) => {
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

    res.redirect('/books');
  } else {
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Книга не найдена!',
    });
  }
});

booksRouter.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  const idx = Database.books.findIndex(el => el.id === id);

  if (idx !== -1) {
    Database.books.splice(idx, 1);
    res.redirect('/books');
  } else {
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Книга не найдена!',
    });
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
      }
    });
  } else {
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Книга не найдена!',
    });
  }
});

export default booksRouter;
