import axios from 'axios';

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




}

export default new BookService();
