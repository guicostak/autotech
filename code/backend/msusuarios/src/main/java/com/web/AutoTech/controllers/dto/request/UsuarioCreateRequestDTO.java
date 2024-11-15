package com.web.AutoTech.controllers.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Accessors(chain = true)
public class UsuarioCreateRequestDTO {

    @NotBlank
    @Size(min = 2, max = 100)
    private String nome;

    @NotBlank
    @Email(message = "Email deve ser válido")
    private String email;

    @NotBlank
    @Size(min = 8, max = 60)
    private String password;

    @NotBlank
    @Size(min = 11, max = 11, message = "CPF deve ter 11 dígitos")
    private String cpf;
}
