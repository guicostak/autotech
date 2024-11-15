package com.web.AutoTech.domain;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.web.AutoTech.controllers.dto.request.VendedorCreateRequestDTO;
import com.web.AutoTech.domain.enums.PerfilEnum;
import com.web.AutoTech.domain.enums.UserRole;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;

@Entity
@Table(name = UsuarioDomainEntity.TABLE_NAME)
@Inheritance(strategy = InheritanceType.JOINED)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Builder
public class UsuarioDomainEntity implements UserDetails {

    public static final String TABLE_NAME = "usuario";

    @Id
    @Column(name = "id", unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imagem")
    private String imagem;

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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "data_nascimento")
    private LocalDate dataNascimento; 
    
    @Column(name = "telefone", length = 15, unique = true)
    private String telefone;

    @Column(name = "classificacao_usuario")
    private Integer classificacaoUsuario;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference 
    @OrderBy("id ASC")
    private List<EnderecoDomainEntity> enderecos;

    @Column(name = "confirmation_token", nullable = false, unique = true)
    private String confirmationToken;

    @Column(name = "email_confirmed", nullable = false)
    private boolean emailConfirmed;

    private UserRole role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UserRole.ADMIN) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER"));
        } else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

}
