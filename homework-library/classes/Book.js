import { v4 as uuidv4 } from 'uuid';

export default class Book {
  constructor(title, description, authors, fileCover, fileName, fileBook, favorite = false, id = uuidv4()) {
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
    this.favorite = favorite;
    this.id = id;
  }
}
