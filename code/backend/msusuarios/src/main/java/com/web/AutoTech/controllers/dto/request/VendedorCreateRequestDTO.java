package com.web.AutoTech.controllers.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Accessors(chain = true)
public class VendedorCreateRequestDTO {

    @NotNull(message = "ID do usuário não pode ser nulo.")
    private Long usuarioId;
    
    @NotBlank(message = "Nome fantasia não pode ser vazio.")
    private String nomeFantasia;

    @NotBlank(message = "CNPJ não pode ser vazio.")
    @Size(min = 14, max = 14, message = "CNPJ deve ter 14 dígitos.")
    @Pattern(regexp = "\\d{14}", message = "CNPJ deve conter apenas números.")
    private String cnpj;

    @Email(message = "Email deve ser válido")
    private String emailEmpresa;

    private String descricao;

    @NotBlank(message = "Telefone da empresa não pode ser vazio.")
    @Size(max = 15, message = "Telefone da empresa deve ter no máximo 15 dígitos.")
    private String telefoneEmpresa;

    private String imagemPerfil;

    private Integer classificacaoVendedor;

}

