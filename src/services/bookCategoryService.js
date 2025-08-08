import axios from 'axios';

const BOOK_CATEGORY_API_BASE_URL = "http://localhost:8080/api/categories";

class BookCategoryService {

  // Получить все категории
  getAllCategories() {
    return axios.get(`${BOOK_CATEGORY_API_BASE_URL}/get-all-categories`);
  }

  // Получить категорию по ID
  getCategoryById(categoryId) {
    return axios.get(`${BOOK_CATEGORY_API_BASE_URL}/get-category/${categoryId}`);
  }

  // Добавить новую категорию
  addCategory(category) {
    return axios.post(`${BOOK_CATEGORY_API_BASE_URL}/add-category`, category);
  }

  // Обновить категорию
  updateCategory(categoryId, updatedCategory) {
    return axios.put(`${BOOK_CATEGORY_API_BASE_URL}/update-category/${categoryId}`, updatedCategory);
  }

  // Удалить категорию по ID
  deleteCategory(categoryId) {
    return axios.delete(`${BOOK_CATEGORY_API_BASE_URL}/delete-category/${categoryId}`);
  }
}

export default new BookCategoryService();
