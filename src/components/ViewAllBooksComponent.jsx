import React, { useEffect, useState, useCallback } from 'react';
import BookService from '../services/bookService';
import '../styles/ViewAllBooksComponent.css';
import { useAuth } from '../components/AuthContext'; 

const ViewAllBooksComponent = ({ searchQuery, selectedGenreId, categories, addToBasket, basket }) => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [editedBook, setEditedBook] = useState({
    bookName: '',
    authorName: '',
    releaseDate: '',
    bookImage: '',
    categoryId: null,
    quantity: 1
  });

  const [releaseDateError, setReleaseDateError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { currentUser, userRole } = useAuth();
  const booksPerPage = 8;

  const fetchBooks = useCallback(() => {
    BookService.getBooksFiltered(selectedGenreId)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setBooks(data);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке книг:", error);
        setBooks([]);
      });
  }, [selectedGenreId]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = (bookId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту книгу?")) {
      BookService.deleteBook(bookId)
        .then(() => {
          setBooks((prevBooks) => prevBooks.filter((b) => b.bookId !== bookId));
        })
        .catch((error) => {
          console.error("Ошибка при удалении книги:", error);
        });
    }
  };

  const handleTakeBook = (book) => {
    alert(`Книга "${book.bookName}" взята пользователем!`);
    addToBasket(book); 
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setEditedBook({
      ...book,
      categoryId: book.categoryId || '',
      quantity: book.quantity || 1 // если нужно, можно добавить поле quantity в DTO
    });
    setReleaseDateError('');
  };

  const closeModal = () => {
    setEditingBook(null);
    setReleaseDateError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoryId' || name === 'quantity') {
      setEditedBook((prev) => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setEditedBook((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdate = () => {
    const today = new Date().toISOString().split("T")[0];
    if (editedBook.releaseDate > today) {
      setReleaseDateError("Дата выпуска не может быть в будущем.");
      return;
    }
    BookService.updateBook(editedBook.bookId, editedBook)
      .then(() => {
        fetchBooks();
        closeModal();
      })
      .catch((error) => {
        console.error("Ошибка при обновлении книги:", error);
        setReleaseDateError("Ошибка при обновлении книги.");
      });
  };

  const filteredBooks = books.filter((book) => {
    const query = searchQuery?.toLowerCase() || '';
    return (
      book.bookName.toLowerCase().includes(query) ||
      book.authorName.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => (
    <div className="pagination">
      <button
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
          onClick={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="books-container">
      <h2 className="title">Все книги</h2>

      <div className="cards-wrapper">
        {currentBooks.length === 0 ? (
          <p>Книги не найдены.</p>
        ) : (
          currentBooks.map((book) => (
            <div className="book-card" key={book.bookId}>
              <img src={book.bookImage} alt={book.bookName} className="book-image" />
              <div className="book-details">
                <h3>{book.bookName}</h3>
                <p><strong>Автор:</strong> {book.authorName}</p>
                <p><strong>Дата выпуска:</strong> {book.releaseDate}</p>
                <p><strong>Жанр:</strong> {book.genre || 'Не указан'}</p>

                {currentUser && (
                  <div className="button-group">
                    {userRole === "ROLE_ADMIN" && (
                      <>
                        <button className="edit-button" onClick={() => openEditModal(book)}>Изменить</button>
                        <button className="delete-button" onClick={() => handleDelete(book.bookId)}>Удалить</button>
                      </>
                    )}
                    <button
  className="take-button"
  onClick={() => handleTakeBook(book)}
  disabled={basket.some(b => b.bookId === book.bookId) || book.quantity === 0}
>
  {book.quantity === 0 
    ? "Нет в наличии" 
    : basket.some(b => b.bookId === book.bookId) 
      ? "Уже выбрана" 
      : "Взять книгу"}
</button>

                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination-wrapper">{renderPagination()}</div>

      {editingBook && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Редактировать книгу</h3>
            <label>
              Название:
              <input
                type="text"
                name="bookName"
                value={editedBook.bookName}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Автор:
              <input
                type="text"
                name="authorName"
                value={editedBook.authorName}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Дата выпуска:
              <input
                type="date"
                name="releaseDate"
                value={editedBook.releaseDate}
                onChange={handleEditChange}
                max={new Date().toISOString().split("T")[0]}
              />
              {releaseDateError && <p className="error-text">{releaseDateError}</p>}
            </label>
            <label>
              Ссылка на обложку:
              <input
                type="text"
                name="bookImage"
                value={editedBook.bookImage}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Жанр:
              <select
                name="categoryId"
                value={editedBook.categoryId || ''}
                onChange={handleEditChange}
              >
                <option value="">Выберите жанр</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.genre}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Количество:
              <input
                type="number"
                name="quantity"
                value={editedBook.quantity}
                onChange={handleEditChange}
                min="1"
              />
            </label>

            <div className="modal-buttons">
              <button className="save-button" onClick={handleUpdate}>Сохранить</button>
              <button className="cancel-button" onClick={closeModal}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllBooksComponent;
