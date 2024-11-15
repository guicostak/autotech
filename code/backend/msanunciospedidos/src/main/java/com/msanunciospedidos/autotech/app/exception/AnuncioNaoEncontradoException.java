package com.msanunciospedidos.autotech.app.exception;

public class AnuncioNaoEncontradoException extends PedidoException {
    public AnuncioNaoEncontradoException(Long anuncioId) {
        super("Anúncio com ID " + anuncioId + " não foi encontrado");
    }
}
