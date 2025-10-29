import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import bookService from '../services/bookService';
import '../styles/MyBooksComponent.css';

const MyBooksComponent = () => {
  const { currentUser, userRole } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser && userRole !== 'ROLE_ADMIN') return;

    const fetchBooks = async () => {
      try {
        const response = await bookService.getMyBooks();
        setBooks(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке книг:', err.response?.status, err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentUser, userRole]);

  const returnBook = async (bookId) => {
    try {
      await bookService.returnBook(bookId);
      setBooks(prev => prev.filter(b => b.bookId !== bookId));
    } catch (err) {
      alert(err.response?.data || 'Ошибка при возврате книги');
    }
  };

  const returnAllBooks = async () => {
    try {
      await Promise.all(books.map(b => bookService.returnBook(b.bookId)));
      setBooks([]);
    } catch (err) {
      alert('Ошибка при возврате всех книг');
    }
  };

  if (loading) {
    return <p className="loading-text">Загрузка ваших книг...</p>;
  }

 const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Almaty'
  });
};


  return (
    <div className="my-books-container">
      <h2 className="title">Мои книги ({books.length})</h2>

      {books.length === 0 ? (
        <div className="books-empty">
          <div className="books-icon">📚</div>
          <p>У вас пока нет взятых книг.</p>
        </div>
      ) : (
        <>
          <div className="my-books-wrapper">
            {books.map((book) => (
              <div className="my-book-card" key={book.bookId}>
                <img
                  src={book.bookImage}
                  alt={book.bookName}
                  className="my-book-image"
                />
                <div className="my-book-details">
                  <h3>{book.bookName}</h3>
                  <p><strong>Автор:</strong> {book.authorName}</p>
                  <p><strong>Жанр:</strong> {book.genre}</p>
                  {userRole === 'ROLE_ADMIN' && (
                    <p><strong>Взял:</strong> {book.userEmail}</p>
                  )}
                  <p><strong>Дата выдачи:</strong> {formatDateTime(book.borrowedAt)}</p>
                </div>

                <button
                  className="return-button"
                  onClick={() => returnBook(book.bookId)}
                  aria-label="Вернуть книгу"
                >
                  Вернуть
                </button>
              </div>
            ))}
          </div>

          <div className="books-actions">
            <button className="return-all-button" onClick={returnAllBooks}>
              Вернуть все книги
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyBooksComponent;
