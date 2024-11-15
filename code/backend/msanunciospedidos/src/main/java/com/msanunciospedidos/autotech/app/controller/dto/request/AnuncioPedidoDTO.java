package com.msanunciospedidos.autotech.app.controller.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
public class AnuncioPedidoDTO {

    @NotNull
    private Long anuncioId;

    @Min(1)
    private Integer quantidade;
}
