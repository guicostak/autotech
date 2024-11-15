// package com.msanunciospedidos.autotech.app.service.notificacao;

// import com.msanunciospedidos.autotech.app.domain.PedidoStatusEvento;
// import jakarta.mail.MessagingException;
// import jakarta.mail.internet.MimeMessage;
// import org.springframework.amqp.rabbit.annotation.RabbitListener;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.mail.javamail.MimeMessageHelper;
// import org.springframework.stereotype.Service;

// @Service
// public class EmailNotificationConsumer {

//     private final JavaMailSender mailSender;

//     public EmailNotificationConsumer(JavaMailSender mailSender) {
//         this.mailSender = mailSender;
//     }

//     @RabbitListener(queues = "email-notification-queue")
//     public void receberNotificacaoDeEmail(PedidoStatusEvento evento) {
//         try {
//             enviarEmail(evento.getEmail(), evento.getStatus());
//         } catch (MessagingException e) {
//             // Log de erro
//         }
//     }

//     private void enviarEmail(String emailDestinatario, String status) throws MessagingException {
//         MimeMessage message = mailSender.createMimeMessage();
//         MimeMessageHelper helper = new MimeMessageHelper(message, true);
//         helper.setTo(emailDestinatario);
//         helper.setSubject("Atualização do status do seu pedido");
//         helper.setText("Seu pedido foi atualizado para: " + status, true);

//         mailSender.send(message);
//     }
// }
