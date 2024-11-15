package com.msanunciospedidos.autotech.app.exception;

public class PedidoException extends RuntimeException {

    public PedidoException(String message) {
        super(message);
    }

    public PedidoException(String message, Throwable cause) {
        super(message, cause);
    }
}
