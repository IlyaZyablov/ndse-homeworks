import Book from '../classes/Book.js';

export default class Database {
  static books = [
    new Book('Игра престолов', 'роман в жанре фэнтези', 'Джордж Р.Р. Мартин', 'серая', 'A_Game_of_Thrones.pdf', 'demo.txt'),
    new Book('Преступление и наказание', 'социально-психологический роман', 'Ф.М. Достоевский', 'белая', 'Crime_&_Punishment.pdf', 'demo.txt'),
  ];

  static addBook(title, description, authors, fileCover, fileName, fileBook) {
    const newBook = new Book(title, description, authors, fileCover, fileName, fileBook);
    this.books.push(newBook);

    return newBook;
  }
}
