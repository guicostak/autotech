package com.msanunciospedidos.autotech.app.domain;

import lombok.Data;

import java.io.Serializable;

@Data
public class PedidoStatusEvento implements Serializable {

    private Long pedidoId;
    private String email;
    private String status;

    // Construtor, getters e setters

    public PedidoStatusEvento(Long pedidoId, String email, String status) {
        this.pedidoId = pedidoId;
        this.email = email;
        this.status = status;
    }

    // Getters e Setters
}
