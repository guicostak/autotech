package com.web.AutoTech.controllers.dto.request;

import org.hibernate.validator.constraints.br.CNPJ;

import com.web.AutoTech.domain.VendedorDomainEntity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VendedorUpdateRequestDTO {

    @NotNull(message = "ID do usuário não pode ser nulo.")
    private Long usuarioId;
    
    @Size(max = 100, message = "Nome fantasia deve ter no máximo 100 caracteres.")
    private String nomeFantasia;

    @NotBlank(message = "CNPJ não pode ser vazio.")
    @Size(min = 14, max = 14, message = "CNPJ deve ter 14 dígitos.")
    @Pattern(regexp = "\\d{14}", message = "CNPJ deve conter apenas números.")
    @CNPJ(message = "O CNPJ fornecido é inválido")
    private String cnpj;

    @Email(message = "Email deve ser válido")
    private String emailEmpresa;

    private String descricao;

    @Size(max = 15, message = "Telefone da empresa deve ter no máximo 15 dígitos.")
    private String telefoneEmpresa;

    private String imagemPerfil;

    private Integer classificacaoVendedor;

    public void applyTo(VendedorDomainEntity vendedorDomainEntity) {
        if (nomeFantasia != null) {
            vendedorDomainEntity.setNomeFantasia(nomeFantasia);
        }

        if (cnpj != null) {
            vendedorDomainEntity.setCnpj(cnpj);
        }

        vendedorDomainEntity.setEmailEmpresa(emailEmpresa);

        if (descricao != null) {
            vendedorDomainEntity.setDescricao(descricao);
        }

        if (telefoneEmpresa != null) {
            vendedorDomainEntity.setTelefoneEmpresa(telefoneEmpresa);
        }

        if (imagemPerfil != null) {
            vendedorDomainEntity.setImagem_perfil(imagemPerfil);
        }

        if (classificacaoVendedor != null) {
            vendedorDomainEntity.setClassificacaoVendedor(classificacaoVendedor);
        }

    }
}
