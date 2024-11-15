package com.msanunciospedidos.autotech.app.infrastructure.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public FanoutExchange pedidoStatusExchange() {
        return new FanoutExchange("pedido-status-exchange");
    }

    @Bean
    public Queue emailQueue() {
        return new Queue("email-notification-queue");
    }

    @Bean
    public Queue pushQueue() {
        return new Queue("push-notification-queue");
    }

    @Bean
    public Binding bindingEmailQueue(FanoutExchange pedidoStatusExchange, Queue emailQueue) {
        return BindingBuilder.bind(emailQueue).to(pedidoStatusExchange);
    }

    @Bean
    public Binding bindingPushQueue(FanoutExchange pedidoStatusExchange, Queue pushQueue) {
        return BindingBuilder.bind(pushQueue).to(pedidoStatusExchange);
    }
}
