import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import BooksDB from '../database/models/books_schema.js';
import uploadFile from '../middleware/file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const booksRouter = express.Router();

booksRouter.get('/', async (req, res) => {
  try {
    const books = await BooksDB.find().select('-__v');

    res.render('books/index', {
      title: 'Список книг',
      books,
    });
  } catch (error) {
    console.error(error);
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Ошибка при загрузке книг!',
    });
  }
});

booksRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BooksDB.findById(id).select('-__v');

    res.render('books/view', {
      title: book.title,
      book,
    });
  } catch (error) {
    console.error(error);
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Книга не найдена!',
    });
  }
});

booksRouter.post('/', uploadFile.single('fileBook'), async (req, res) => {
  const {
    title, description, authors, fileCover,
  } = req.body;

  if (req.file) {
    const newBook = new BooksDB({
      title,
      description,
      authors,
      fileCover,
      fileName: req.file.originalname,
      fileBook: req.file.filename,
    });

    try {
      await newBook.save();

      res.redirect('/books');
    } catch (error) {
      console.error(error);
      res.render('errors/404', {
        title: 'Ошибка!',
        text: 'Возникла ошибка при добавлении книги!',
      });
    }
  } else {
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Необходимо добавить файл книги!',
    });
  }
});

booksRouter.get('/update/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BooksDB.findById(id).select('-__v');

    res.render('books/update', {
      title: book.title,
      book,
    });
  } catch (error) {
    console.error(error);
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Книга не найдена!',
    });
  }
});

booksRouter.post('/update/:id', async (req, res) => {
  const { id } = req.params;

  const {
    title, description, authors, fileCover,
  } = req.body;

  try {
    await BooksDB.findByIdAndUpdate(id, {
      title,
      description,
      authors,
      fileCover,
    });

    res.redirect('/books');
  } catch (error) {
    console.error(error);
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Возникла ошибка при обновлении книги!',
    });
  }
});

booksRouter.post('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await BooksDB.findByIdAndDelete(id);

    res.redirect('/books');
  } catch (error) {
    console.error(error);
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Возникла ошибка при удалении книги!',
    });
  }
});

booksRouter.get('/:id/download', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BooksDB.findById(id).select('fileBook');

    res.download(path.join(__dirname, '..', `public/books/${book.fileBook}`), error => {
      if (error) {
        console.log('[ERROR] Download book:');
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
    res.render('errors/404', {
      title: 'Ошибка!',
      text: 'Книга не найдена!',
    });
  }
});

export default booksRouter;
