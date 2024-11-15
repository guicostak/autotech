package com.web.AutoTech.services.usuario;

import com.web.AutoTech.controllers.dto.request.CompleteAddressRequestDTO;
import com.web.AutoTech.controllers.dto.request.UsuarioCreateRequestDTO;
import com.web.AutoTech.controllers.dto.request.UsuarioUpdateRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorUpdateRequestDTO;
import com.web.AutoTech.domain.EnderecoDomainEntity;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.builder.UsuarioBuilder;
import com.web.AutoTech.domain.enums.EmailType;
import com.web.AutoTech.exceptions.BusinessException;
import com.web.AutoTech.exceptions.DataBindingViolationException;
import com.web.AutoTech.exceptions.ObjectNotFoundException;
import com.web.AutoTech.infrastructure.config.security.JwtTokenProvider;
import com.web.AutoTech.repositories.EnderecoDomainEntityRepository;
import com.web.AutoTech.repositories.UsuarioDomainEntityRepository;
import com.web.AutoTech.services.aws.S3Service;
import com.web.AutoTech.services.email.EmailService;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private static final Logger logger = LogManager.getLogger(UsuarioServiceImpl.class);

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final UsuarioDomainEntityRepository usuarioDomainEntityRepository;

    private final EnderecoDomainEntityRepository enderecoDomainEntityRepository;

    private final EmailService emailService;

    private final S3Service s3Service;

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public UsuarioDomainEntity getUserById(final Long id) {
        logger.info("Buscando usuário por ID: {}", id);
        return usuarioDomainEntityRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Usuário não encontrado. ID: {}", id);
                    return new ObjectNotFoundException("Usuário não encontrado! Id: " + id + ", Tipo: " + UsuarioDomainEntity.class.getName());
                });
    }

    @Override
    public UsuarioDomainEntity getUserByEmail(final String email) {
        logger.info("Buscando usuário por email: {}", email);
        return usuarioDomainEntityRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Usuário não encontrado. Email: {}", email);
                    return new ObjectNotFoundException("Usuário não cadastrado! Crie uma conta. ");
                });
    }

    @Transactional
    @Override
    public UsuarioDomainEntity createUser(final UsuarioCreateRequestDTO request) throws MessagingException, IOException {

        logger.info("Criando novo usuário com email: {}", request.getEmail());

        if (this.usuarioDomainEntityRepository.existsUserByEmailOrCpf(request.getEmail(), request.getCpf())) {
            logger.info("Usuario com email {} ou cpf {} já cadastrados. ", request.getEmail(), request.getCpf());
            throw new BusinessException("Usuário já está cadastrado");
        }

        request.setPassword(encodePassword(request.getPassword()));

        final var usuario = UsuarioBuilder.toDomain(request);
        usuario.setConfirmationToken(String.valueOf(UUID.randomUUID()));

        final var savedUser = usuarioDomainEntityRepository.save(usuario);

        emailService.sendEmail(request.getEmail(), EmailType.EMAIL_CONFIRMATION.toString());

        logger.info("Usuário criado com sucesso. ID: {}", savedUser.getId());

        return usuario;
    }

    @Transactional
    @Override
    public EnderecoDomainEntity completeProfileUsuario(final CompleteAddressRequestDTO request, final Long id) {
    logger.info("Completando endereço do perfil do usuário com ID: {}", id);

    final var usuario = getUserById(id);

     EnderecoDomainEntity endereco = new EnderecoDomainEntity();
     endereco.setCep(request.getCep());
     endereco.setEstado(request.getEstado());
     endereco.setCidade(request.getCidade());
     endereco.setRua(request.getRua());
     endereco.setComplemento(request.getComplemento());
     endereco.setNumero(request.getNumero());
     endereco.setBairro(request.getBairro());
 
     endereco.setUsuario(usuario);
 
     enderecoDomainEntityRepository.save(endereco);
 
     usuarioDomainEntityRepository.save(usuario);
 
     logger.info("Perfil do usuário com ID: {} completado com sucesso", id);
 
     return endereco;
}

    @Transactional
    @Override
    public void updateAddressUsuario(CompleteAddressRequestDTO request, Long id) {
        logger.info("Atualizando endereço do usuário com ID: {}", id);

        final var usuario = getUserById(id);
        
        EnderecoDomainEntity endereco = usuario.getEnderecos().stream()
        .findFirst()
        .orElseThrow(() -> new EntityNotFoundException("Endereço não encontrado para o usuário com ID: " + id));

        endereco.setCep(request.getCep());
        endereco.setEstado(request.getEstado());
        endereco.setCidade(request.getCidade());
        endereco.setRua(request.getRua());
        endereco.setComplemento(request.getComplemento());
        endereco.setNumero(request.getNumero());
        endereco.setBairro(request.getBairro());

        enderecoDomainEntityRepository.save(endereco);

        logger.info("Endereço do usuário com ID: {} atualizado com sucesso", id);
    }

    @Transactional
    @Override
    @SneakyThrows
    public void updateUser(final UsuarioUpdateRequestDTO request, final Long id) {

        logger.info("Atualizando senha do usuário com ID: {}", id);

        final var usuario = getUserById(id);

        if(!Objects.equals(usuario.getCpf(), request.getCpf()) &&
                usuarioDomainEntityRepository.existsUserByCpf(request.getCpf())) {
            throw new BusinessException("CPF já cadastrado");
        }

        request.applyTo(usuario);

        if (Objects.nonNull(request.getImagemPerfil())){
            final var imagemUrl = s3Service.uploadFile(request.getImagemPerfil());
            usuario.setImagem(imagemUrl);
        } else {
            usuario.setImagem(null);
        }

        final var updatedUser = usuarioDomainEntityRepository.save(usuario);

        logger.info("Usuario com o ID: {} atualizado com sucesso. ", updatedUser.getId());
    }

    @Override
    public void deleteUser(final Long id) {

        logger.info("Deletando usuário com ID: {}", id);

        try {
            usuarioDomainEntityRepository.deleteById(id);

            logger.info("Usuário deletado com sucesso. ID: {}", id);

        } catch (DataIntegrityViolationException e) {
            logger.error("Erro ao tentar deletar o usuário com ID: {}. Violação de integridade de dados.", id, e);
            throw new DataBindingViolationException("Não é possível excluir um usuário relacionado a outra entidade.");

        } catch (Exception e) {
            logger.error("Erro inesperado ao tentar deletar o usuário com ID: {}", id, e);
            throw new RuntimeException("Erro interno ao tentar deletar o usuário. Contate o suporte.");
        }
    }

    @Override
    public boolean confirmEmail(final String confirmationToken) {
        final var user = usuarioDomainEntityRepository.findByConfirmationToken(confirmationToken);

        if (user.isEmpty()) {
            throw new BusinessException("O Token fornecido é inválido");
        }

        if (this.isEmailConfirmed(user.get().getEmail())) {
            throw new BusinessException("Email já confirmado anteriormente");
        }

        user.get().setEmailConfirmed(true);
        usuarioDomainEntityRepository.save(user.get());

        return true;
    }

    private boolean isEmailConfirmed(String email) {

        final var user = usuarioDomainEntityRepository.findByEmail(email);

        return user.get().isEmailConfirmed();
    }

    @Override
    public Long getUserIdByAdress(final Long addressId) {
        logger.info("Obtendo ID do usuário pelo ID do endereço: {}", addressId);
        return enderecoDomainEntityRepository.findById(addressId)
                .map(endereco -> endereco.getUsuario().getId())
                .orElseThrow(() -> new EntityNotFoundException("Endereço não encontrado para o ID fornecido: " + addressId));
    }

    private String encodePassword(String rawPassword) {
        return bCryptPasswordEncoder.encode(rawPassword);
    }


}
