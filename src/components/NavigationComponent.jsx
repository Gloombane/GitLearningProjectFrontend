import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCategoryService from '../services/bookCategoryService';
import '../styles/NavigationComponent.css';
import { useAuth } from '../components/AuthContext';

const NavigationComponent = ({ onSearch, onGenreChange, categories, setCategories, basketCount }) => {
  const [showModal, setShowModal] = useState(false);
  const [genre, setGenre] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { currentUser, userRole, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {}, [currentUser, userRole]);

  const handleAddCategory = async () => {
    if (!genre.trim()) {
      alert("Название категории не может быть пустым");
      return;
    }

    try {
      const response = await BookCategoryService.addCategory({ genre });
      alert('Категория успешно добавлена!');
      setCategories(prev => [...prev, response.data]);
      setGenre('');
      setShowModal(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Произошла ошибка при добавлении категории';
      alert(message);
    }
  };

  const handleGenreSelect = (genreId) => {
    onGenreChange(genreId === 'all' ? null : genreId);
    navigate('/');
    setDropdownOpen(false);
  };

  const handleInputChange = (e) => onSearch(e.target.value);

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
                  <button onClick={() => handleGenreSelect('all')}>Все жанры</button>
                  {categories.map((cat) => (
                    <button key={cat.categoryId} onClick={() => handleGenreSelect(cat.categoryId)}>
                      {cat.genre}
                    </button>
                  ))}
                </div>
              )}
            </li>

            {currentUser && userRole === "ROLE_ADMIN" && (
              <>
                <li><Link to="/add-book">Добавить книгу</Link></li>
                <li><button className="plain-link-btn" onClick={() => setShowModal(true)}>Добавить категорию</button></li>
                <li><Link to="/categories">Показать категории</Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-right">
          <input
            className="navbar-search-input"
            type="text"
            placeholder="Поиск - название/автор"
            onChange={handleInputChange}
          />

          {/* 🟢 Иконка корзины только для авторизованных пользователей (не админов) */}
          {currentUser && (
            <button
              className="nav-auth-btn"
              style={{ marginLeft: '10px' }}
              onClick={() => navigate('/basket')}
            >
              🛒 {basketCount > 0 && <span>({basketCount})</span>}
            </button>
          )}

          {/* 📖 Мои книги — для всех авторизованных пользователей */}
          {currentUser && (
            <button
              className="nav-auth-btn"
              style={{ marginLeft: '10px' }}
              onClick={() => navigate('/my-books')}
            >
              📖 Мои книги
            </button>
          )}

          {currentUser ? (
            <button className="nav-auth-btn" onClick={logOut} style={{ marginLeft: '10px' }}>Выйти</button>
          ) : (
            <Link to="/login" className="nav-auth-btn" style={{ marginLeft: '10px' }}>Войти</Link>
          )}
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
