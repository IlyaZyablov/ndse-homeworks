import { Schema, model } from 'mongoose';

const booksSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  authors: {
    type: String,
    required: true,
  },
  fileCover: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileBook: {
    type: String,
    required: true,
  },
  favorite: {
    type: String,
    default: '',
  },
});

const BooksDB = model('BooksDB', booksSchema);

export default BooksDB;
