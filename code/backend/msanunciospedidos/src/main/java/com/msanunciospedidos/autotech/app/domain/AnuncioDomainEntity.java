package com.msanunciospedidos.autotech.app.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "anuncio")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
public class AnuncioDomainEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = true)
    private UsuarioDomainEntity usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendedor_id", nullable = true)
    private VendedorDomainEntity vendedor;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String titulo;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String modelo;

    @NotBlank
    @Size(max = 1000)
    @Column(nullable = false, length = 1000)
    private String descricao;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String marca;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String categoria;

    @NotNull
    @Min(1)
    @Column(name = "quantidade_produtos", nullable = false)
    private Integer quantidadeProdutos;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @NotNull
    @Min(1900)
    @Max(2100)
    @Column(name = "ano_fabricacao", nullable = false)
    private Integer anoFabricacao;

    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @NotNull
    @Column(nullable = false)
    private Boolean ativo;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "anuncio_imagens", joinColumns = @JoinColumn(name = "anuncio_id"))
    @Column(name = "imagem_link")
    private List<@NotBlank String> imagensLinks;
}
