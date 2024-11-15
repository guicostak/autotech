// package com.msanunciospedidos.autotech.app.service.notificacao;

// import com.msanunciospedidos.autotech.app.domain.PedidoDomainEntity;
// import com.msanunciospedidos.autotech.app.domain.PedidoStatusEvento;
// import org.springframework.amqp.rabbit.core.RabbitTemplate;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// @Service
// public class PedidoStatusPublisher {

//     private final RabbitTemplate rabbitTemplate;

//     @Value("${rabbitmq.exchange.pedido-status}")
//     private String exchange;

//     public PedidoStatusPublisher(RabbitTemplate rabbitTemplate) {
//         this.rabbitTemplate = rabbitTemplate;
//     }

//     public void publicarMudancaDeStatus(PedidoDomainEntity pedido, String novoStatus) {
//         PedidoStatusEvento evento = new PedidoStatusEvento(pedido.getId(), pedido.getUsuario().getEmail(), novoStatus);
//         rabbitTemplate.convertAndSend(exchange, "", evento);
//     }
// }
