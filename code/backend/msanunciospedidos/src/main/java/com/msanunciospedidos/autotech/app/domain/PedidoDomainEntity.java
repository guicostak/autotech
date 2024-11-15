package com.msanunciospedidos.autotech.app.domain;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = PedidoDomainEntity.TABLE_NAME)
@Data
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class PedidoDomainEntity {

    public static final String TABLE_NAME = "pedido";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioDomainEntity usuario;

    @ElementCollection
    @CollectionTable(name = "pedido_anuncios", joinColumns = @JoinColumn(name = "pedido_id"))
    @Column(name = "anuncio_quantidade")
    private List<AnuncioPedido> anuncioPedidos;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @Column(name = "data_pedido", nullable = false)
    private LocalDateTime dataPedido;

    @Column(nullable = false, length = 20)
    private String statusPagamento; // Pendente, Aprovado, Cancelado

    @Column(name = "url_pagamento")
    private String urlPagamento;

    public PedidoDomainEntity addAnuncioPedido(AnuncioPedido anuncioPedido) {
        this.anuncioPedidos.add(anuncioPedido);
        return this;
    }
}

