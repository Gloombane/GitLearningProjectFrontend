import React, { useState, useEffect } from 'react';
import BookService from '../services/bookService';
import BookCategoryService from '../services/bookCategoryService';
import '../styles/AddBookComponent.css';
import { useNavigate } from 'react-router-dom';

const AddBookComponent = () => {
  const [book, setBook] = useState({
    bookName: '',
    authorName: '',
    releaseDate: '',
    bookImage: '',
    categoryId: '',
    quantity: ''   
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Загрузка категорий при монтировании
  useEffect(() => {
    BookCategoryService.getAllCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении категорий:", error);
        alert("Не удалось загрузить жанры.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверка обязательных полей
    if (!book.bookName.trim() ||
        !book.authorName.trim() ||
        !book.releaseDate ||
        !book.categoryId ||
        !book.quantity) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }

    // Проверка количества
    if (Number(book.quantity) < 1) {
      alert("Количество должно быть не меньше 1!");
      return;
    }

    // Проверка даты выпуска
    const today = new Date().toISOString().split("T")[0];
    if (book.releaseDate > today) {
      alert("Дата выпуска не может быть в будущем!");
      return;
    }

    // Подготовка объекта для отправки на бэкенд
    const bookToSend = {
      ...book,
      categoryId: Number(book.categoryId),
      quantity: Number(book.quantity)
    };

    BookService.addBook(bookToSend)
      .then(() => {
        alert("Книга успешно добавлена!");
        navigate('/books');
      })
      .catch((error) => {
        console.error("Ошибка при добавлении книги:", error);
        alert("Ошибка при добавлении книги.");
      });
  };

  return (
    <div className="add-book-container">
      <h2 className="title">Добавить новую книгу</h2>
      <form className="add-book-form" onSubmit={handleSubmit}>
        <label>
          Название:
          <input
            type="text"
            name="bookName"
            value={book.bookName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Автор:
          <input
            type="text"
            name="authorName"
            value={book.authorName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Дата выпуска:
          <input
            type="date"
            name="releaseDate"
            value={book.releaseDate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </label>
        <label>
          Ссылка на обложку:
          <input
            type="text"
            name="bookImage"
            value={book.bookImage}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Жанр:
          <select
            name="categoryId"
            value={book.categoryId}
            onChange={handleChange}
            required
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
            value={book.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </label>

        <button type="submit" className="submit-button">Добавить</button>
      </form>
    </div>
  );
};

export default AddBookComponent;
