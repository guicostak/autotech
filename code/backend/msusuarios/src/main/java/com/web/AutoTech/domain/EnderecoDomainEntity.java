package com.web.AutoTech.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Entity
@Table(name = "endereco")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Builder
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

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonBackReference 
    private UsuarioDomainEntity usuario;


    @ManyToOne
    @JoinColumn(name = "vendedor_id") 
    @JsonBackReference 
    private VendedorDomainEntity vendedor;
}
