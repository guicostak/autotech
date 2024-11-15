package com.msanunciospedidos.autotech.app.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class NotificacaoDomainEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long pedidoId;

    private String usuarioEmail;

    private String mensagem;

    private LocalDateTime dataEnvio;

    private String tipo; // "email" ou "push"

    // Getters e setters
}
