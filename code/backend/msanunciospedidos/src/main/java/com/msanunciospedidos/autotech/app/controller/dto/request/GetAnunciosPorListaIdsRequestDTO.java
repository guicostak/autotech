package com.msanunciospedidos.autotech.app.controller.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAnunciosPorListaIdsRequestDTO {

    @JsonProperty("listaids")
    @NotNull(message = "A lista de ids é obrigatória")
    private List<Long> listaids;
}
