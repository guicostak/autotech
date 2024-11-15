package com.web.AutoTech.services.usuario;

import com.web.AutoTech.controllers.dto.request.CompleteAddressRequestDTO;
import com.web.AutoTech.controllers.dto.request.UsuarioCreateRequestDTO;
import com.web.AutoTech.controllers.dto.request.UsuarioUpdateRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorCreateRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorUpdateRequestDTO;
import com.web.AutoTech.domain.EnderecoDomainEntity;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.VendedorDomainEntity;

import jakarta.mail.MessagingException;

import java.io.IOException;
import java.security.InvalidKeyException;

public interface UsuarioService {

    UsuarioDomainEntity getUserById(Long id);

    UsuarioDomainEntity getUserByEmail(String email);

    UsuarioDomainEntity createUser(final UsuarioCreateRequestDTO request) throws MessagingException, IOException;

    EnderecoDomainEntity completeProfileUsuario(final CompleteAddressRequestDTO request, final Long id) throws MessagingException, IOException;

    void updateAddressUsuario(final CompleteAddressRequestDTO request, final Long id) throws InvalidKeyException;

    void updateUser(final UsuarioUpdateRequestDTO request, final Long id) throws InvalidKeyException;

    void deleteUser(final Long id);

    boolean confirmEmail(final String confirmationToken);

    Long getUserIdByAdress(final Long adressId);
}
