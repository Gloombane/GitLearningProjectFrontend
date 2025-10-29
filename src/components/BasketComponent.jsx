import React, { useState, useEffect } from 'react';
import '../styles/BasketComponent.css';
import bookService from '../services/bookService';

const BasketComponent = ({ basket, removeFromBasket, clearBasket }) => {
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTotalItems(basket.length);
  }, [basket]);

  const handleConfirmSelection = async () => {
    if (basket.length === 0) {
      alert("Корзина пуста!");
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failMessages = [];

    for (const book of basket) {
      try {
        await bookService.borrowBook(book.bookId);
        successCount++;
      } catch (error) {
        const msg =
          error.response?.data ||
          `Не удалось взять книгу "${book.bookName}".`;
        failMessages.push(msg);
      }
    }

    setLoading(false);

    if (successCount > 0) {
      alert(`Успешно взято ${successCount} книг(и).`);
      clearBasket(); // очищаем корзину после подтверждения
    }

    if (failMessages.length > 0) {
      alert("Ошибки:\n" + failMessages.join("\n"));
    }
  };

  return (
    <div className="basket-container">
      <h2 className="title">
        Корзина ({totalItems} {totalItems === 1 ? 'книга' : 'книг'})
      </h2>
      {basket.length === 0 ? (
        <div className="basket-empty">
          <div className="basket-icon">🛒</div>
          <p>Корзина пуста</p>
        </div>
      ) : (
        <>
          <div className="basket-cards-wrapper">
            {basket.map((book) => (
              <div className="basket-card" key={book.bookId}>
                <img
                  src={book.bookImage}
                  alt={book.bookName}
                  className="basket-book-image"
                />
                <div className="basket-book-details">
                  <h3>{book.bookName}</h3>
                  <p><strong>Автор:</strong> {book.authorName}</p>
                  <p><strong>Жанр:</strong> {book.genre || 'Не указан'}</p>
                </div>
                <button
                  className="remove-cross"
                  onClick={() => removeFromBasket(book.bookId)}
                  aria-label="Удалить книгу"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="basket-actions">
            <button
              className="confirm-button"
              onClick={handleConfirmSelection}
              disabled={loading}
            >
              {loading ? "Обработка..." : "Подтвердить выбор"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BasketComponent;
