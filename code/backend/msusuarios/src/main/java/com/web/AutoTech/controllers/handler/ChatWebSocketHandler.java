package com.web.AutoTech.controllers.handler;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final RabbitTemplate rabbitTemplate;
    private static final String EXCHANGE_NAME = "chat_exchange";

    public ChatWebSocketHandler(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String msgContent = message.getPayload();
        String routingKey = "chat.conversation";
        rabbitTemplate.convertAndSend(EXCHANGE_NAME, routingKey, msgContent);

        session.sendMessage(new TextMessage("Mensagem enviada para RabbitMQ: " + msgContent));
    }
}

