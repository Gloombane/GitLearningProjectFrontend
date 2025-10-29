import React, { useState, useEffect } from "react";
import ChatService from "../services/chatService";
import { useAuth } from "../components/AuthContext";
import "../styles/ChatComponent.css";

const ChatComponent = () => {
  const { userEmail, userRole } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null); // 🟡 только для админа
  const [userList, setUserList] = useState([]); // 🟡 список пользователей для админа

  useEffect(() => {
    if (!userEmail) return;

    ChatService.connect(userEmail, userRole, (msg) => {
      setMessages((prev) => [...prev, msg]);

      // если админ и пришло новое сообщение — добавляем отправителя в список
      if (userRole === "ROLE_ADMIN" && msg.sender && msg.sender !== "ADMIN") {
        setUserList((prev) =>
          prev.includes(msg.sender) ? prev : [...prev, msg.sender]
        );
      }
    });

    return () => ChatService.disconnect();
  }, [userEmail, userRole]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const receiver = userRole === "ROLE_ADMIN" ? selectedUser : "ADMIN";
    if (!receiver) {
      alert("Выберите пользователя");
      return;
    }

    ChatService.sendMessage(userEmail, newMessage, receiver);
    setNewMessage("");
  };

  // 🟢 Обычный пользовательский интерфейс
  const renderUserChat = () => (
    <div className="chat-window">
      <div className="chat-header">
        💬 Чат с администратором
        <button onClick={() => setIsOpen(false)}>✖</button>
      </div>
      <div className="chat-messages">
        {messages
          .filter(
            (m) =>
              m.sender === "ADMIN" ||
              m.sender === userEmail ||
              m.receiver === userEmail
          )
          .map((m, i) => (
            <div
              key={i}
              className={`chat-message ${
                m.sender === userEmail ? "mine" : ""
              }`}
            >
              <b>{m.sender}:</b> {m.content}
            </div>
          ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );

  // 🟣 Интерфейс для администратора
  const renderAdminChat = () => {
    const handleCloseUser = (user) => {
      // 🧹 Удаляем пользователя из списка и чистим его сообщения
      setUserList((prev) => prev.filter((u) => u !== user));
      setMessages((prev) =>
        prev.filter((m) => m.sender !== user && m.receiver !== user)
      );
      if (selectedUser === user) {
        setSelectedUser(null);
      }
    };

    return (
      <div className="chat-window admin-chat">
        <div className="chat-header">
          💬 Чат с пользователями
          <button onClick={() => setIsOpen(false)}>✖</button>
        </div>

        {/* 🔹 Верхняя панель с вкладками пользователей */}
        <div className="chat-users-bar">
          {userList.length === 0 ? (
            <p className="no-users">Нет активных пользователей</p>
          ) : (
            userList.map((u) => (
              <div
                key={u}
                className={`user-tab ${u === selectedUser ? "active" : ""}`}
              >
                <button
                  className="user-name"
                  onClick={() => setSelectedUser(u)}
                >
                  {u}
                </button>
                <button
                  className="close-user"
                  onClick={() => handleCloseUser(u)}
                  title="Закрыть диалог"
                >
                  ✖
                </button>
              </div>
            ))
          )}
        </div>

        {/* 🔹 Тело чата (сообщения + ввод) */}
        {selectedUser ? (
          <>
            <div className="chat-messages">
              {messages
                .filter(
                  (m) =>
                    (m.sender === selectedUser && m.receiver === "ADMIN") ||
                    (m.sender === "ADMIN" && m.receiver === selectedUser)
                )
                .map((m, i) => (
                  <div
                    key={i}
                    className={`chat-message ${
                      m.sender === "ADMIN" ? "mine" : ""
                    }`}
                  >
                    <b>{m.sender}:</b> {m.content}
                  </div>
                ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Сообщение для ${selectedUser}`}
              />
              <button onClick={handleSend}>Отправить</button>
            </div>
          </>
        ) : (
          <div className="no-user-selected">Выберите пользователя</div>
        )}
      </div>
    );
  };

  // 🟤 Проверяем, гость ли это (если нет email или роли)
  const isGuest =
    !userEmail || (!userRole || (userRole !== "ROLE_ADMIN" && userRole !== "ROLE_USER"));

  return (
    <div className={`chat-wrapper ${isGuest ? "chat-hidden" : ""}`}>
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        💬 Чат
      </button>
      {isOpen &&
        (userRole === "ROLE_ADMIN" ? renderAdminChat() : renderUserChat())}
    </div>
  );
};

export default ChatComponent;
