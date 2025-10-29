import axios from "axios";
axios.defaults.withCredentials = true;


const BOOK_API_BASE_URL = "http://localhost:8080/api/books";

class BookService {

// Получить книги с фильтрацией по жанру (с optional-параметром)
getBooksFiltered(categoryId = null) {
  if (categoryId === null) {
    return axios.get(`${BOOK_API_BASE_URL}`);
  }
  return axios.get(`${BOOK_API_BASE_URL}?genreId=${categoryId}`);
}
  // Получить книгу по ID
  getBookById(bookId) {
    return axios.get(`${BOOK_API_BASE_URL}/${bookId}`);
  }

  // Добавить новую книгу
  addBook(book) {
    return axios.post(`${BOOK_API_BASE_URL}/addBook`, book);
  }

  // Обновить книгу
  updateBook(bookId, updatedBook) {
    return axios.put(`${BOOK_API_BASE_URL}/update/${bookId}`, updatedBook);
  }

  // Удалить книгу по ID
  deleteBook(bookId) {
    return axios.delete(`${BOOK_API_BASE_URL}/delete/${bookId}`);
  }

// Взять книгу
borrowBook(bookId) {
  return axios.post(`${BOOK_API_BASE_URL}/${bookId}/borrow`);
}

// Вернуть книгу (если реализуешь)
returnBook(bookId) {
  return axios.post(`${BOOK_API_BASE_URL}/${bookId}/return`);
}

// Получить список моих взятых книг
getMyBooks() {
  return axios.get(`${BOOK_API_BASE_URL}/my`);
}



}

const bookService = new BookService();
export default bookService;
