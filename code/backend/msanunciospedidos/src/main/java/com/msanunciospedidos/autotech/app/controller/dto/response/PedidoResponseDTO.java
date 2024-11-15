package com.msanunciospedidos.autotech.app.controller.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Accessors(chain = true)
public class PedidoResponseDTO {

    @JsonProperty("pedido_id")
    private Long pedidoId;

    @JsonProperty("valor_total")
    private BigDecimal valorTotal;

    @JsonProperty("status_pagamento")
    private String statusPagamento;

    @JsonProperty("url_pagamento")
    private String urlPagamento;

    @JsonProperty("data_pedido")
    private LocalDateTime dataPedido;
}
