package com.msanunciospedidos.autotech.app.service.pedido;

import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.msanunciospedidos.autotech.app.controller.dto.request.PedidoRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.response.PedidoResponseDTO;
import com.msanunciospedidos.autotech.app.domain.AnuncioPedido;
import com.msanunciospedidos.autotech.app.domain.PedidoDomainEntity;
import com.msanunciospedidos.autotech.app.exception.AnuncioNaoEncontradoException;
import com.msanunciospedidos.autotech.app.exception.PedidoException;
import com.msanunciospedidos.autotech.app.repository.AnuncioRepository;
import com.msanunciospedidos.autotech.app.repository.PedidoRepository;
import com.msanunciospedidos.autotech.app.repository.UsuarioRepository;
import com.msanunciospedidos.autotech.app.service.mercadopago.MercadoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AnuncioRepository anuncioRepository;
    private final MercadoPagoService mercadoPagoService;

    @Autowired
    public PedidoService(PedidoRepository pedidoRepository,
                         UsuarioRepository usuarioRepository,
                         AnuncioRepository anuncioRepository,
                         MercadoPagoService mercadoPagoService) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.anuncioRepository = anuncioRepository;
        this.mercadoPagoService = mercadoPagoService;
    }

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO pedidoRequest) throws MPException, MPApiException {

        var usuario = usuarioRepository.findById(pedidoRequest.getUsuarioId())
                .orElseThrow(() -> new PedidoException("Usuário não encontrado"));

        var anuncioPedidos = pedidoRequest.getAnuncios().stream()
                .map(dto -> {
                    var anuncio = anuncioRepository.findById(dto.getAnuncioId())
                            .orElseThrow(() -> new AnuncioNaoEncontradoException(dto.getAnuncioId()));

                    if (anuncio.getQuantidadeProdutos() < dto.getQuantidade()) {
                        throw new PedidoException("Quantidade solicitada excede o disponível no estoque para o anúncio " + dto.getAnuncioId());
                    }

                    anuncio.setQuantidadeProdutos(anuncio.getQuantidadeProdutos() - dto.getQuantidade());
                    anuncioRepository.save(anuncio);

                    return new AnuncioPedido(dto.getAnuncioId(), dto.getQuantidade());
                })
                .toList();

        var valorTotal = anuncioPedidos.stream()
                .map(ap -> anuncioRepository.findById(ap.getAnuncioId())
                        .orElseThrow(() -> new AnuncioNaoEncontradoException(ap.getAnuncioId()))
                        .getPreco().multiply(BigDecimal.valueOf(ap.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        var pedido = PedidoDomainEntity.builder()
                .usuario(usuario)
                .anuncioPedidos(anuncioPedidos)
                .valorTotal(valorTotal)
                .dataPedido(LocalDateTime.now())
                .statusPagamento("PENDENTE")
                .build();

        var urlPagamento = mercadoPagoService.criarPreferenciaPagamento(pedido);

        pedido.setUrlPagamento(urlPagamento);

        var pedidoSalvo = pedidoRepository.save(pedido);

        return new PedidoResponseDTO()
                .setPedidoId(pedidoSalvo.getId())
                .setValorTotal(pedidoSalvo.getValorTotal())
                .setStatusPagamento(pedidoSalvo.getStatusPagamento())
                .setUrlPagamento(pedidoSalvo.getUrlPagamento())
                .setDataPedido(pedidoSalvo.getDataPedido());
    }
}



