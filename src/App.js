import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ViewAllBooksComponent from './components/ViewAllBooksComponent';
import AddBookComponent from './components/AddBookComponent';
import NavigationComponent from './components/NavigationComponent';

function App() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedGenreId, setSelectedGenreId] = React.useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenreId(genreId);
  };

  return (
    <div>
      <Router>
        <NavigationComponent
          onSearch={handleSearch}
          onGenreChange={handleGenreChange}
        />
        <div className="container">
          <Routes>
            {/* 🟢 Главная страница теперь тоже показывает книги */}
            <Route
              path="/"
              element={
                <ViewAllBooksComponent
                  searchQuery={searchQuery}
                  selectedGenreId={selectedGenreId}
                />
              }
            />
            <Route
              path="/books"
              element={
                <ViewAllBooksComponent
                  searchQuery={searchQuery}
                  selectedGenreId={selectedGenreId}
                />
              }
            />
            <Route path="/add-book" element={<AddBookComponent />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

