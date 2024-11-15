package com.web.AutoTech.domain.builder;

import com.web.AutoTech.controllers.dto.request.VendedorCreateRequestDTO;
import com.web.AutoTech.domain.VendedorDomainEntity;

import jakarta.validation.Valid;

public class VendedorBuilder {

    public static VendedorDomainEntity toDomain(final @Valid VendedorCreateRequestDTO request) {
        VendedorDomainEntity vendedor = new VendedorDomainEntity()
            .setNomeFantasia(request.getNomeFantasia())
            .setCnpj(request.getCnpj())
            .setDescricao(request.getDescricao())
            .setTelefoneEmpresa(request.getTelefoneEmpresa())
            .setImagem_perfil(request.getImagemPerfil())
            .setClassificacaoVendedor(request.getClassificacaoVendedor());

            vendedor.setEmailEmpresa(request.getEmailEmpresa() != null ? request.getEmailEmpresa() : null);

        return vendedor;
    }
}
