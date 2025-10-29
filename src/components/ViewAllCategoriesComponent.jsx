import React, { useState } from "react";
import BookCategoryService from "../services/bookCategoryService";
import "../styles/ViewAllCategoriesComponent.css";

const ViewAllCategoriesComponent = ({ categories, setCategories }) => {
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newGenre, setNewGenre] = useState("");

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      try {
        await BookCategoryService.deleteCategory(id);
        setCategories((prev) => prev.filter((cat) => cat.categoryId !== id));
      } catch (error) {
        console.error("Ошибка при удалении категории:", error);
      }
    }
  };

  const startEditing = (category) => {
    setEditingCategoryId(category.categoryId);
    setNewGenre(category.genre);
  };

  const handleUpdate = async (id) => {
    if (!newGenre.trim()) {
      alert("Название категории не может быть пустым");
      return;
    }

    try {
      await BookCategoryService.updateCategory(id, { genre: newGenre });
      setCategories((prev) =>
        prev.map((cat) =>
          cat.categoryId === id ? { ...cat, genre: newGenre } : cat
        )
      );
      setEditingCategoryId(null);
      setNewGenre("");
    } catch (error) {
      console.error("Ошибка при обновлении категории:", error);
    }
  };

  return (
    <div className="categories-container">
      <h2>Все категории</h2>
      <table className="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th className="genre-cell">Жанр</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryId}>
              <td>{cat.categoryId}</td>
              <td className="genre-cell">
                {editingCategoryId === cat.categoryId ? (
                  <input
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                  />
                ) : (
                  cat.genre
                )}
              </td>
              <td className="action-buttons">
                {editingCategoryId === cat.categoryId ? (
                  <button
                    className="save-button"
                    onClick={() => handleUpdate(cat.categoryId)}
                  >
                    Сохранить
                  </button>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => startEditing(cat)}
                  >
                    Изменить
                  </button>
                )}
                <button
                  className="delete-button"
                  onClick={() => handleDelete(cat.categoryId)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="3">Нет категорий</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllCategoriesComponent;

