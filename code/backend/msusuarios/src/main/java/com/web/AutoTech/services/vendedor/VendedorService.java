package com.web.AutoTech.services.vendedor;

import com.web.AutoTech.controllers.dto.request.CompleteAddressRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorCreateRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorUpdateRequestDTO;
import com.web.AutoTech.domain.EnderecoDomainEntity;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.VendedorDomainEntity;
import jakarta.mail.MessagingException;

import java.io.IOException;
import java.security.InvalidKeyException;

public interface VendedorService {

    void deleteVendedor(final Long id);

    void updateVendedor(final VendedorUpdateRequestDTO request, final Long id) throws InvalidKeyException;

    void updateAddressVendedor(final CompleteAddressRequestDTO request, final Long id) throws InvalidKeyException;

    void createVendedor(final UsuarioDomainEntity usuario, final VendedorCreateRequestDTO request)
            throws MessagingException, IOException;

    EnderecoDomainEntity completeProfileVendedor(final CompleteAddressRequestDTO request, final Long id)
            throws MessagingException, IOException;

    VendedorDomainEntity getVendedorByUsuarioId(Long id);
}
