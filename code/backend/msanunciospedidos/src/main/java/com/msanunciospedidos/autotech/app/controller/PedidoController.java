package com.msanunciospedidos.autotech.app.controller;

import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.msanunciospedidos.autotech.app.controller.dto.request.PedidoRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.response.PedidoResponseDTO;
import com.msanunciospedidos.autotech.app.service.pedido.PedidoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    @Autowired
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(@Valid
                                                             @RequestBody PedidoRequestDTO pedidoRequest) {
        try {
            PedidoResponseDTO pedidoResponse = pedidoService.criarPedido(pedidoRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(pedidoResponse);
        } catch (MPException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (RuntimeException | MPApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
