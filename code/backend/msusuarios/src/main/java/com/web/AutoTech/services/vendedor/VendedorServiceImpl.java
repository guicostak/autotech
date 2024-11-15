package com.web.AutoTech.services.vendedor;

import com.web.AutoTech.controllers.dto.request.CompleteAddressRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorCreateRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorUpdateRequestDTO;
import com.web.AutoTech.domain.EnderecoDomainEntity;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import com.web.AutoTech.domain.VendedorDomainEntity;
import com.web.AutoTech.domain.builder.VendedorBuilder;
import com.web.AutoTech.exceptions.BusinessException;
import com.web.AutoTech.exceptions.DataBindingViolationException;
import com.web.AutoTech.exceptions.ObjectNotFoundException;
import com.web.AutoTech.repositories.EnderecoDomainEntityRepository;
import com.web.AutoTech.repositories.VendedorDomainEntityRepository;
import com.web.AutoTech.services.aws.S3Service;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.InvalidKeyException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class VendedorServiceImpl implements VendedorService {

    private final VendedorDomainEntityRepository vendedorDomainEntityRepository;

    private final S3Service s3Service;

    private static final Logger logger = LogManager.getLogger(VendedorServiceImpl.class);

    private final EnderecoDomainEntityRepository enderecoDomainEntityRepository;

    @Override
    public void deleteVendedor(final Long id) {
        logger.info("Deletando vendedor com ID: {}", id);
        try {
            vendedorDomainEntityRepository.deleteById(id);
            logger.info("Vendedor deletado com sucesso. ID: {}", id);
        } catch (DataIntegrityViolationException e) {
            logger.error("Erro ao tentar deletar o vendedor com ID: {}. Violação de integridade de dados.", id, e);
            throw new DataBindingViolationException("Não é possível excluir um vendedor relacionado a outra entidade.");
        } catch (Exception e) {
            logger.error("Erro inesperado ao tentar deletar o vendedor com ID: {}", id, e);
            throw new RuntimeException("Erro interno ao tentar deletar o vendedor. Contate o suporte.");
        }
    }

    @Override
    public VendedorDomainEntity getVendedorByUsuarioId(final Long usuarioId) {
        logger.info("Buscando vendedor para o usuário com ID: {}", usuarioId);

        return vendedorDomainEntityRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> {
                    logger.warn("Vendedor não encontrado para o usuário com ID: {}", usuarioId);
                    return new ObjectNotFoundException("Vendedor não encontrado! Usuário ID: " + usuarioId + ", Tipo: " + VendedorDomainEntity.class.getName());
                });
    }

    @Transactional
    @Override
    @SneakyThrows
    public void createVendedor(UsuarioDomainEntity usuario, VendedorCreateRequestDTO request) {
        logger.info("Criando novo vendedor com cnpj: {}", request.getCnpj());

        if (this.vendedorDomainEntityRepository.existsUserByCnpj(request.getCnpj())) {
            logger.info("Vendedor com cnpj {} já cadastrado. ", request.getCnpj());
            throw new BusinessException("CNPJ já está cadastrado");
        }

        if (this.vendedorDomainEntityRepository.existsUserByEmailEmpresa(request.getEmailEmpresa())) {
            logger.info("Vendedor com email {} já cadastrado. ", request.getEmailEmpresa());
            throw new BusinessException("Email já está cadastrado");
        }

        VendedorDomainEntity vendedor = VendedorBuilder.toDomain(request);

        vendedor.setUsuario(usuario);

        if (Objects.nonNull(request.getImagemPerfil())){
            final var imagemUrl = s3Service.uploadFile(request.getImagemPerfil());
            vendedor.setImagem_perfil(imagemUrl);
        }

        final var savedVendedor = vendedorDomainEntityRepository.save(vendedor);

        logger.info("Vendedor criado com sucesso. ID: {}", savedVendedor.getId());

    }

    @Transactional
    @Override
    public EnderecoDomainEntity completeProfileVendedor(final CompleteAddressRequestDTO request, final Long usuarioId) {
        logger.info("Completando o perfil do vendedor associado ao usuário com ID: {}", usuarioId);

        final var vendedor = getVendedorByUsuarioId(usuarioId);

        final var endereco = new EnderecoDomainEntity()
                .setCep(request.getCep())
                .setEstado(request.getEstado())
                .setCidade(request.getCidade())
                .setRua(request.getRua())
                .setComplemento(request.getComplemento())
                .setNumero(request.getNumero())
                .setBairro(request.getBairro())
                .setVendedor(vendedor);

        enderecoDomainEntityRepository.save(endereco);

        vendedorDomainEntityRepository.save(vendedor);

        logger.info("Perfil do vendedor associado ao usuário com ID: {} completado com sucesso.", usuarioId);

        return endereco;
    }

    @Transactional
    @Override
    public void updateAddressVendedor(final CompleteAddressRequestDTO request, final Long usuarioId) throws InvalidKeyException {
        logger.info("Atualizando endereço do vendedor associado ao usuário com ID: {}", usuarioId);

        final var vendedor = getVendedorByUsuarioId(usuarioId);

        EnderecoDomainEntity endereco = vendedor.getEnderecos().stream()
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Endereço não encontrado para o vendedor associado ao usuário com ID: " + usuarioId));

        endereco.setCep(request.getCep());
        endereco.setEstado(request.getEstado());
        endereco.setCidade(request.getCidade());
        endereco.setRua(request.getRua());
        endereco.setComplemento(request.getComplemento());
        endereco.setNumero(request.getNumero());
        endereco.setBairro(request.getBairro());

        enderecoDomainEntityRepository.save(endereco);

        logger.info("Endereço do usuário com ID: {} atualizado com sucesso", usuarioId);
    }

    @Transactional
    @Override
    @SneakyThrows
    public void updateVendedor(final VendedorUpdateRequestDTO request, final Long usuarioId) {
        logger.info("Atualizando vendedor associado ao usuário com ID: {}", usuarioId);

        final var vendedor = vendedorDomainEntityRepository.findByUsuarioId(usuarioId)
                .orElseThrow(
                        () ->
                                new ObjectNotFoundException("Vendedor não encontrado para o usuário com ID: " + usuarioId)
                );

        if (vendedorDomainEntityRepository.existsUserByCnpj(request.getCnpj()) &&
                !Objects.equals(vendedor.getCnpj(), request.getCnpj())) {

            logger.info("Vendedor com cnpj {} já cadastrado. ", request.getCnpj());
            throw new BusinessException("CNPJ já cadastrado");
        }
        request.applyTo(vendedor);

        if (Objects.nonNull(request.getImagemPerfil())){
            final var imagemUrl = s3Service.uploadFile(request.getImagemPerfil());
            vendedor.setImagem_perfil(imagemUrl);
        } else {
            vendedor.setImagem_perfil(null);
        }

        final var updatedVendedor = vendedorDomainEntityRepository.save(vendedor);

        logger.info("Vendedor com o ID: {} associado ao usuário com ID: {} atualizado com sucesso.", updatedVendedor.getId(), usuarioId);
    }
}
