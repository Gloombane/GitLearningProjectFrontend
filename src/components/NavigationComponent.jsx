import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCategoryService from '../services/bookCategoryService';
import '../styles/NavigationComponent.css';

const NavigationComponent = ({ onSearch, onGenreChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [genre, setGenre] = useState('');
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await BookCategoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!genre.trim()) return;

    try {
      await BookCategoryService.addCategory({ genre });
      alert('Категория успешно добавлена!');
      setGenre('');
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Произошла ошибка при добавлении категории';
      alert(message);
    }
  };

  const handleGenreChange = (genreId) => {
    onGenreChange(genreId === 'all' ? null : genreId);
    navigate('/'); // Или '/books', если ты отображаешь книги там
    setDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">📚 Книжный Архив</div>
          <ul className="navbar-links">
            <li
              className="dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="nav-button">Книги ▾</button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <button onClick={() => handleGenreChange('all')}>Все жанры</button>
                  {categories.map((cat) => (
                    <button key={cat.categoryId} onClick={() => handleGenreChange(cat.categoryId)}>
                      {cat.genre}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li>
              <Link to="/add-book">Добавить книгу</Link>
            </li>
            <li>
              <button className="plain-link-btn" onClick={() => setShowModal(true)}>
                Добавить категорию
              </button>
            </li>
          </ul>
        </div>
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Поиск по названию или автору..."
            onChange={handleInputChange}
          />
        </div>
      </nav>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Добавить категорию</h2>
            <input
              type="text"
              placeholder="Название жанра"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAddCategory}>Добавить</button>
              <button onClick={() => setShowModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationComponent;
