package com.msanunciospedidos.autotech.app.controller.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Accessors(chain = true)
public class AnuncioResponseDTO {

    @JsonProperty("anuncio_id")
    private Long anuncioId;

    @JsonProperty("titulo")
    private String titulo;

    @JsonProperty("modelo")
    private String modelo;

    @JsonProperty("descricao")
    private String descricao;

    @JsonProperty("marca")
    private String marca;

    @JsonProperty("categoria")
    private String categoria;

    @JsonProperty("preco")
    private BigDecimal preco;

    @JsonProperty("quantidade_produtos")
    private Integer quantidadeProdutos;

    @JsonProperty("ano_fabricacao")
    private Integer anoFabricacao;

    @JsonProperty("ativo")
    private Boolean ativo;

    @JsonProperty("data_criacao")
    private LocalDateTime dataCriacao;

    @JsonProperty("imagens")
    private List<String> imagens;
}
