// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ViewAllBooksComponent from './components/ViewAllBooksComponent';
import AddBookComponent from './components/AddBookComponent';
import NavigationComponent from './components/NavigationComponent';
import ViewAllCategoriesComponent from './components/ViewAllCategoriesComponent';
import BookCategoryService from './services/bookCategoryService';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import { AuthProvider } from './components/AuthContext';
import BasketComponent from './components/BasketComponent';
import MyBooksComponent from './components/MyBooksComponent';
import ChatComponent from './components/ChatComponent'; // 🟢 добавляем импорт чата

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [categories, setCategories] = useState([]);

  // ✅ Загружаем корзину из localStorage при первом рендере
  const [basket, setBasket] = useState(() => {
    const savedBasket = localStorage.getItem("basket");
    return savedBasket ? JSON.parse(savedBasket) : [];
  });

  // ✅ Сохраняем корзину в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(basket));
  }, [basket]);

  const handleSearch = (query) => setSearchQuery(query);
  const handleGenreChange = (genreId) => setSelectedGenreId(genreId);

  const addToBasket = (book) => {
    setBasket((prev) => {
      // Проверка: не больше 10 книг
      if (prev.length >= 10) {
        alert("Вы не можете взять больше 10 книг одновременно.");
        return prev;
      }

      // Проверка: книга уже есть
      if (prev.some((b) => b.bookId === book.bookId)) {
        alert(`Книга "${book.bookName}" уже в корзине.`);
        return prev;
      }

      // Добавляем книгу
      return [...prev, book];
    });
  };

  const removeFromBasket = (bookId) => {
    setBasket((prev) => prev.filter(b => b.bookId !== bookId));
  };

  // ✅ Очистка корзины (используется при logout)
  const clearBasket = () => {
    setBasket([]);
    localStorage.removeItem("basket");
  };

  const fetchCategories = async () => {
    try {
      const response = await BookCategoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Router>
      <AuthProvider clearBasket={clearBasket}>
        <NavigationComponent
          onSearch={handleSearch}
          onGenreChange={handleGenreChange}
          categories={categories}
          setCategories={setCategories}
          basketCount={basket.length}
        />

        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <ViewAllBooksComponent
                  searchQuery={searchQuery}
                  selectedGenreId={selectedGenreId}
                  categories={categories}
                  addToBasket={addToBasket}
                  basket={basket}
                />
              }
            />
            <Route
              path="/books"
              element={
                <ViewAllBooksComponent
                  searchQuery={searchQuery}
                  selectedGenreId={selectedGenreId}
                  categories={categories}
                  addToBasket={addToBasket}
                  basket={basket}
                />
              }
            />
            <Route path="/add-book" element={<AddBookComponent />} />
            <Route
              path="/categories"
              element={<ViewAllCategoriesComponent categories={categories} setCategories={setCategories} />}
            />
            <Route
              path="/basket"
              element={<BasketComponent basket={basket} removeFromBasket={removeFromBasket} clearBasket={clearBasket} />}
            />
            <Route
              path="/my-books"
              element={<MyBooksComponent />}
            />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />
          </Routes>
        </div>

        {/* 💬 Чат — отображается на всех страницах */}
        <ChatComponent />
      </AuthProvider>
    </Router>
  );
}

export default App;
