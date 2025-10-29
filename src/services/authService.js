import axios from "axios";
axios.defaults.withCredentials = true;

const AUTH_API_BASE_URL = "http://localhost:8080/api/auth";

class AuthService {
  // Логин
  login(email, password) {
    return axios.post(
      `${AUTH_API_BASE_URL}/login`,
      new URLSearchParams({
        email: email,
        password: password,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true, // для работы с кукой sessionId
      }
    );
  }

  // Регистрация
 register(email, password) {
  return axios.post(
    `${AUTH_API_BASE_URL}/register`,
    new URLSearchParams({
      email: email,
      password: password,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      withCredentials: true,
    }
  );
}

  // Логаут
  logout() {
    return axios.post(`${AUTH_API_BASE_URL}/logout`, {}, { withCredentials: true });
  }
}

// ✅ Создаем экземпляр и экспортируем
const authService = new AuthService();
export default authService;
