package com.msanunciospedidos.autotech.app.controller.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Accessors(chain = true)
public class AnuncioRequestDTO {

    @JsonProperty("anunciante_id")
    private Long anuncianteId;

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

    @JsonProperty("pessoa_juridica")
    private Boolean pessoaJuridica;

    @JsonProperty("quantidade_produtos")
    private Integer quantidadeProdutos;

    @JsonProperty("ano_fabricacao")
    private Integer anoFabricacao;

    @JsonProperty("is_vendedor")
    private boolean isVendedor;
}
