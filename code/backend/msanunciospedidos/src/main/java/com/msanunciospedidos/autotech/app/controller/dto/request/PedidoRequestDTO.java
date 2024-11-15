package com.msanunciospedidos.autotech.app.controller.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
public class PedidoRequestDTO {

    @NotNull
    @JsonProperty("usuario_id")
    private Long usuarioId;

    @NotNull
    @JsonProperty("anuncios")
    private List<AnuncioPedidoDTO> anuncios;
}
