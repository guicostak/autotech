package com.msanunciospedidos.autotech.app.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Entity
@Table(name = "endereco")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class EnderecoDomainEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cep", length = 8, nullable = false)
    @NotBlank
    private String cep;

    @Column(name = "estado", length = 2, nullable = false)
    @NotBlank
    private String estado;

    @Column(name = "cidade", length = 100, nullable = false)
    @NotBlank
    private String cidade;

    @Column(name = "rua", length = 100, nullable = false)
    @NotBlank
    private String rua;

    @Column(name = "complemento")
    private String complemento;

    @Column(name = "numero", length = 10, nullable = false)
    @NotBlank
    private String numero;

    @Column(name = "bairro", length = 100, nullable = false)
    @NotBlank
    private String bairro;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    @JsonBackReference(value = "usuario-endereco")
    private UsuarioDomainEntity usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendedor_id")
    @JsonBackReference(value = "vendedor-endereco")
    private VendedorDomainEntity vendedor;
}
