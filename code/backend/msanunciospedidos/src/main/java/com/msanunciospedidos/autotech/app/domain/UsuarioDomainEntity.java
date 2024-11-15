package com.msanunciospedidos.autotech.app.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.br.CPF;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = UsuarioDomainEntity.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Accessors(chain = true)
public class UsuarioDomainEntity {

    public static final String TABLE_NAME = "usuario";

    @Id
    @Column(name = "id", unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", length = 100, nullable = false, unique = false)
    @Size(min = 3, max = 100)
    @NotBlank
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "O nome não deve conter números ou caracteres especiais")
    private String nome;

    @Column(name = "email", length = 256, nullable = false, unique = true)
    @Size(min = 5, max = 100)
    @NotBlank
    @Email(message = "O Email fornecido é inválido")
    private String email;

    @Column(name = "cpf", length = 11, nullable = false, unique = true)
    @NotBlank
    @Size(min = 11, max = 11, message = "CPF deve ter 11 dígitos")
    @CPF(message = "O CPF fornecido é inválido")
    private String cpf;

    @Column(name = "senha", length = 60, nullable = false)
    @JsonProperty(access = Access.WRITE_ONLY)
    @Size(min = 8, max = 60)
    @NotBlank
    private String password;

    @Column(name = "confirmation_token", nullable = false, unique = true)
    private String confirmationToken;

    @Column(name = "email_confirmed", nullable = false)
    private boolean emailConfirmed;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "usuario-endereco")
    @OrderBy("id ASC")
    private List<EnderecoDomainEntity> enderecos;
}

