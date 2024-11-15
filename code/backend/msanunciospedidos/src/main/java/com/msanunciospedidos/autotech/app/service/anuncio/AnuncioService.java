package com.msanunciospedidos.autotech.app.service.anuncio;

import com.msanunciospedidos.autotech.app.controller.dto.request.AlterarStatusAnuncioRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.request.AnuncioRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.response.AnuncioResponseDTO;
import com.msanunciospedidos.autotech.app.domain.AnuncioDomainEntity;
import com.msanunciospedidos.autotech.app.domain.enums.TipoAnuncioPesquisa;
import com.msanunciospedidos.autotech.app.exception.AnuncioNaoEncontradoException;
import com.msanunciospedidos.autotech.app.exception.EmptyListException;
import com.msanunciospedidos.autotech.app.exception.UsuarioNotFoundException;
import com.msanunciospedidos.autotech.app.exception.VendedorNotFoundException;
import com.msanunciospedidos.autotech.app.repository.AnuncioRepository;
import com.msanunciospedidos.autotech.app.repository.UsuarioRepository;
import com.msanunciospedidos.autotech.app.repository.VendedorDomainEntityRepository;
import com.msanunciospedidos.autotech.app.service.aws.S3Service;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnuncioService {

    private static final Logger logger = LoggerFactory.getLogger(AnuncioService.class);

    private final AnuncioRepository anuncioRepository;
    private final UsuarioRepository usuarioRepository;
    private final S3Service s3Service;
    private final VendedorDomainEntityRepository vendedorDomainEntityRepository;

    @Transactional
    public AnuncioResponseDTO criarAnuncio(AnuncioRequestDTO request,
                                           List<MultipartFile> imagens) {

        final var anuncio = new AnuncioDomainEntity()
                .setTitulo(request.getTitulo())
                .setModelo(request.getModelo())
                .setDescricao(request.getDescricao())
                .setMarca(request.getMarca())
                .setCategoria(request.getCategoria())
                .setPreco(request.getPreco())
                .setQuantidadeProdutos(request.getQuantidadeProdutos())
                .setAtivo(Boolean.TRUE)
                .setDataCriacao(LocalDateTime.now())
                .setAnoFabricacao(request.getAnoFabricacao());
                                            
        logger.info("Valor de isVendedor no serviço: {}", request.isVendedor());

        if(request.isVendedor()) {
            final var vendedor = vendedorDomainEntityRepository.findByUsuarioId(request.getAnuncianteId())
                    .orElseThrow(() -> new VendedorNotFoundException("Vendedor não encontrado para o ID: " + request.getAnuncianteId()));
            anuncio.setVendedor(vendedor);
        } else {
            final var usuario = usuarioRepository.findById(request.getAnuncianteId())
                    .orElseThrow(() -> new UsuarioNotFoundException("Usuário não encontrado para o ID: " + request.getAnuncianteId()));
            anuncio.setUsuario(usuario);
        }

        final var anuncioSalvo = anuncioRepository.save(anuncio);
    
        final List<CompletableFuture<String>> futurosLinks = imagens.stream()
                .map(imagem -> {
                    try {
                        return s3Service.uploadFile(imagem);
                    } catch (IOException e) {
                        logger.error("Erro ao fazer upload da imagem: {}", imagem.getOriginalFilename(), e);
                        throw new RuntimeException("Erro ao fazer upload da imagem: " + e.getMessage());
                    }
                })
                .toList();

        CompletableFuture.allOf(futurosLinks.toArray(new CompletableFuture[0])).thenRun(() -> {
            List<String> links = futurosLinks.stream()
                    .map(CompletableFuture::join)
                    .collect(Collectors.toList());

            anuncioSalvo.setImagensLinks(links);
            anuncioRepository.save(anuncioSalvo);
            logger.info("Imagens do anúncio {} carregadas com sucesso.", anuncioSalvo.getId());
        }).exceptionally(ex -> {
            logger.error("Erro ao processar upload das imagens para o anúncio: " + anuncioSalvo.getId(), ex);
            return null;
        });

        return new AnuncioResponseDTO()
                .setAnuncioId(anuncioSalvo.getId())
                .setTitulo(anuncioSalvo.getTitulo())
                .setModelo(anuncioSalvo.getModelo())
                .setDescricao(anuncioSalvo.getDescricao())
                .setMarca(anuncioSalvo.getMarca())
                .setCategoria(anuncioSalvo.getCategoria())
                .setPreco(anuncioSalvo.getPreco())
                .setQuantidadeProdutos(anuncioSalvo.getQuantidadeProdutos())
                .setAnoFabricacao(anuncioSalvo.getAnoFabricacao())
                .setAtivo(anuncioSalvo.getAtivo())
                .setDataCriacao(anuncioSalvo.getDataCriacao())
                .setImagens(anuncioSalvo.getImagensLinks());
    }

    public AnuncioResponseDTO consultarAnuncio(Long id) {

        return anuncioRepository.findById(id)
                .map(anuncio -> new AnuncioResponseDTO()
                        .setAnuncioId(anuncio.getId())
                        .setTitulo(anuncio.getTitulo())
                        .setModelo(anuncio.getModelo())
                        .setDescricao(anuncio.getDescricao())
                        .setMarca(anuncio.getMarca())
                        .setCategoria(anuncio.getCategoria())
                        .setPreco(anuncio.getPreco())
                        .setQuantidadeProdutos(anuncio.getQuantidadeProdutos())
                        .setAnoFabricacao(anuncio.getAnoFabricacao())
                        .setAtivo(anuncio.getAtivo())
                        .setDataCriacao(anuncio.getDataCriacao())
                        .setImagens(anuncio.getImagensLinks()))

                .orElse(null);
    }

    public Page<AnuncioDomainEntity> listarAnunciosPaginadosComFiltros(
            int page,
            int size,
            String marca,
            String modelo,
            String categoria,
            Double precoMin,
            Double precoMax,
            Integer anoFabricacao,
            String valorPesquisado,
            String campoOrdenacao,
            String ordenacao,
            TipoAnuncioPesquisa tipoAnuncio
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(ordenacao), campoOrdenacao);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<AnuncioDomainEntity> spec = Specification.where(AnuncioSpecification.isAtivo())
                .and(AnuncioSpecification.hasMarca(marca))
                .and(AnuncioSpecification.hasModelo(modelo))
                .and(AnuncioSpecification.hasCategoria(categoria))
                .and(AnuncioSpecification.hasPrecoBetween(precoMin, precoMax))
                .and(AnuncioSpecification.hasAnoFabricacao(anoFabricacao))
                .and(AnuncioSpecification.hasValorPesquisado(valorPesquisado))
                .and(AnuncioSpecification.tipoAnuncioEspecificacao(tipoAnuncio));

        return anuncioRepository.findAll(spec, pageable);
    }

    @Transactional
    public void alterarStatusAnuncio(AlterarStatusAnuncioRequestDTO request, Long anuncioId) {

        final var anuncio = anuncioRepository.findById(anuncioId)
                .orElseThrow(() -> new AnuncioNaoEncontradoException(anuncioId));

        if (anuncio.getAtivo().equals(request.getAtivo())) {
            throw new IllegalStateException("O anúncio já está no status " + (anuncio.getAtivo() ? "ativo" : "inativo"));
        }

        anuncio.setAtivo(request.getAtivo());

        anuncioRepository.save(anuncio);
    }

    @Transactional(readOnly = true)
    public Page<AnuncioDomainEntity> listarAnunciosPorUsuario(Long usuarioId, int page, int size) {

        var vendedor = vendedorDomainEntityRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new VendedorNotFoundException("Vendedor não encontrado"));

        Pageable pageable = PageRequest.of(page, size);

        return anuncioRepository.findByUsuarioIdOrVendedorId(usuarioId, vendedor.getId(), pageable);
    }

    @Transactional(readOnly = true)
    public List<AnuncioDomainEntity> listarAnunciosPorListaDeIds(List<Long> idAnuncios) {

        List<AnuncioDomainEntity> anuncios = anuncioRepository.findAllById(idAnuncios);

        List<Long> idsNaoEncontrados = idAnuncios.stream()
                .filter(id -> anuncios.stream().noneMatch(anuncio -> anuncio.getId().equals(id)))
                .collect(Collectors.toList());

        return anuncios;
    }


    @Transactional
    public void deletarAnuncio(Long anuncioId) {
        final var anuncio = anuncioRepository.findById(anuncioId)
                .orElseThrow(() -> new AnuncioNaoEncontradoException(anuncioId));

        if (anuncio.getImagensLinks() != null) {
            anuncio.getImagensLinks().forEach(link -> {
                String fileName = link.substring(link.lastIndexOf("/") + 1); // Obtém apenas o nome do arquivo
                s3Service.deleteFile(fileName); // Chamando o método de deletar do S3
            });
        }

        anuncioRepository.delete(anuncio);
        logger.info("Anúncio {} excluído com sucesso.", anuncioId);
    }

    public Long getUserByAnuncianteId(Long anuncianteId, boolean isVendedor) {
        if(isVendedor) {
          var vendedor = vendedorDomainEntityRepository.findById(anuncianteId);
          return vendedor.get().getUsuario().getId();
        } else {
            var usuario = usuarioRepository.findById(anuncianteId);
            return usuario.get().getId();
        }
    }

    public Long getUserIdByAnuncioId(Long anuncioId) {
        var anuncio = anuncioRepository.findById(anuncioId);
        if(anuncio.get().getUsuario() == null) {
            return getUserByAnuncianteId(anuncio.get().getVendedor().getId(), true);
        } else {
            return anuncio.get().getUsuario().getId();
        }
    }

}

