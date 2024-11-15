package com.msanunciospedidos.autotech.app.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import java.util.List;

import org.hibernate.validator.constraints.br.CNPJ;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = VendedorDomainEntity.TABLE_NAME)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Getter
@Setter
public class VendedorDomainEntity {

    public static final String TABLE_NAME = "vendedor";

    @Id
    @Column(name = "id", unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imagem_perfil")
    private String imagem_perfil;

    @Column(name = "cnpj", length = 14, unique = true)
    @Size(min = 14, max = 14, message = "CNPJ deve ter 14 dígitos")
    @Pattern(regexp = "\\d{14}", message = "CNPJ deve conter apenas números")
    @CNPJ(message = "O CNPJ fornecido é inválido")
    private String cnpj;

    @Column(name = "nome_fantasia", length = 100)
    private String nomeFantasia;

    @Email(message = "O Email fornecido é inválido")
    @Column(name = "email_empresa")
    private String emailEmpresa;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "telefone_empresa", length = 15)
    private String telefoneEmpresa;

    @Column(name = "classificacao_vendedor")
    private Integer classificacaoVendedor;

    @OneToMany(mappedBy = "vendedor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @OrderBy("id ASC")
    private List<EnderecoDomainEntity> enderecos;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioDomainEntity usuario;

}
