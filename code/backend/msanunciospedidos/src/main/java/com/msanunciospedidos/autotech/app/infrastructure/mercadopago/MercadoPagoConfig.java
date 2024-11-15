package com.msanunciospedidos.autotech.app.infrastructure.mercadopago;

import com.mercadopago.exceptions.MPException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MercadoPagoConfig {

    // Injeção do valor do access token a partir do application.properties
    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Bean
    public String mercadoPagoInitializer() throws MPException {
        // Inicializa o SDK do Mercado Pago com o Access Token
        com.mercadopago.MercadoPagoConfig.setAccessToken(accessToken);
        // Retorna o Access Token ou outra string indicando sucesso
        return "MercadoPago SDK initialized with Access Token";
    }
}
