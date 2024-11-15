package com.msanunciospedidos.autotech.app.controller.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class AlterarStatusAnuncioRequestDTO {

    @JsonProperty("ativo")
    @NotNull(message = "O status ativo é obrigatório")
    private Boolean ativo;
}
