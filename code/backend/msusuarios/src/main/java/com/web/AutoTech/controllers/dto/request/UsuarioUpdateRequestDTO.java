package com.web.AutoTech.controllers.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Accessors(chain = true)
public class UsuarioUpdateRequestDTO {

    @JsonProperty("nome")
    private String nome;

    @JsonProperty("email")
    private String email;

    @CPF(message = "O CPF fornecido é inválido")
    @JsonProperty("cpf")
    private String cpf;

    @JsonProperty("dataNascimento")
    private String dataNascimento;

    @JsonProperty("telefone")
    private String telefone;

    private String imagemPerfil;

    public void applyTo(UsuarioDomainEntity usuarioDomainEntity) {
        if (cpf != null) {
            usuarioDomainEntity.setCpf(cpf);
        }

        if (nome != null) {
            usuarioDomainEntity.setNome(nome);
        }

        if (email != null) {
            usuarioDomainEntity.setEmail(email);
        }

        if (dataNascimento != null && !dataNascimento.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate localDate = LocalDate.parse(dataNascimento, formatter);
            usuarioDomainEntity.setDataNascimento(localDate);
        } else {
            usuarioDomainEntity.setDataNascimento(null);
        }

        if (imagemPerfil != null) {
            usuarioDomainEntity.setImagem(imagemPerfil);
        }

        if (telefone != null && !telefone.isEmpty()) {
            usuarioDomainEntity.setTelefone(telefone);
        } else {
            usuarioDomainEntity.setTelefone(null);
        }
    }
}
