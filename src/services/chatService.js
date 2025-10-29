import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

class ChatService {
  client = null;
  username = null;
  role = null;
  onMessage = null;

  connect(username, role, onMessageReceived) {
    this.username = username;
    this.role = role;
    this.onMessage = onMessageReceived;

    const socket = new SockJS("http://localhost:8080/ws");
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {}, // отключаем консольный спам
    });

    this.client.onConnect = () => {
      console.log("✅ Подключено к WebSocket");

      // подписка на общий топик
      this.client.subscribe("/topic/public", (message) => {
        onMessageReceived(JSON.parse(message.body));
      });

      // личный топик (если понадобится)
      this.client.subscribe(`/user/${username}/queue/messages`, (message) => {
        onMessageReceived(JSON.parse(message.body));
      });

      // уведомляем сервер, что пользователь вошёл
      this.sendEvent("JOIN", `${username} присоединился к чату`);
    };

    this.client.activate();
  }

  sendMessage(sender, content, receiver = "ADMIN") {
    if (!this.client || !this.client.connected) return;

    const msg = { sender, content, receiver, type: "CHAT" };
    this.client.publish({ destination: "/app/chat.send", body: JSON.stringify(msg) });
  }

  sendEvent(type, content) {
    if (!this.client || !this.client.connected) return;

    const msg = { sender: this.username, content, type };
    this.client.publish({ destination: "/app/chat.addUser", body: JSON.stringify(msg) });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      console.log("❌ Отключено от WebSocket");
    }
  }
}

const chatService = new ChatService();
export default chatService;
