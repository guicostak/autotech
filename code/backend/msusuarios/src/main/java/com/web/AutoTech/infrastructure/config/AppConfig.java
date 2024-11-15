package com.web.AutoTech.infrastructure.config;

import com.web.AutoTech.controllers.handler.ChatWebSocketHandler;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    private final RabbitTemplate rabbitTemplate;

    public AppConfig(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Bean
    public ChatWebSocketHandler chatWebSocketHandler() {
        return new ChatWebSocketHandler(rabbitTemplate);
    }
}

