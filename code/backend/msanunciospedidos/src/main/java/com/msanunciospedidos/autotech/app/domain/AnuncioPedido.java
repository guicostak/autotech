package com.msanunciospedidos.autotech.app.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class AnuncioPedido {

    @Column(name = "anuncio_id", nullable = false)
    private Long anuncioId;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;
}
