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
    categoryId: '' // <== изменено: теперь мы храним categoryId
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

    // Приводим categoryId к числу
    const bookToSend = {
      ...book,
      categoryId: Number(book.categoryId)
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
          />
        </label>
        <label>
          Ссылка на обложку:
          <input
            type="text"
            name="bookImage"
            value={book.bookImage}
            onChange={handleChange}
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
        <button type="submit" className="submit-button">Добавить</button>
      </form>
    </div>
  );
};

export default AddBookComponent;
