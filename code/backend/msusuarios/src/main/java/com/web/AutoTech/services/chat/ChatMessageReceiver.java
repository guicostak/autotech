package com.web.AutoTech.services.chat;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class ChatMessageReceiver {

    private final Map<String, WebSocketSession> activeSessions = new HashMap<>();

    public void registerSession(String userId, WebSocketSession session) {
        activeSessions.put(userId, session);
    }

    public void receiveMessage(String message) {
        // Aqui, determine o destinatário e envie a mensagem
        WebSocketSession session = activeSessions.get("<DESTINATION_USER_ID>");
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

