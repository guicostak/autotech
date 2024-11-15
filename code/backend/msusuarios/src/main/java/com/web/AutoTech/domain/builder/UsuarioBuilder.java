package com.web.AutoTech.domain.builder;

import com.web.AutoTech.controllers.dto.request.UsuarioCreateRequestDTO;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.enums.PerfilEnum;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UsuarioBuilder {

    public static UsuarioDomainEntity toDomain(final UsuarioCreateRequestDTO request){

        return new UsuarioDomainEntity()
                .setNome(request.getNome())
                .setEmail(request.getEmail())
                .setPassword(request.getPassword())
                .setCpf(request.getCpf());
    }
}
