package com.msanunciospedidos.autotech.app.service.mercadopago;

import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.msanunciospedidos.autotech.app.domain.PedidoDomainEntity;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class MercadoPagoService {

    public String criarPreferenciaPagamento(PedidoDomainEntity pedido) throws MPException, MPApiException {
        var items = pedido.getAnuncioPedidos().stream()
                .map(ap -> PreferenceItemRequest.builder()
                        .id(ap.getAnuncioId().toString())
                        .title("Anúncio " + ap.getAnuncioId())  // Ajustar para o título correto
                        .quantity(ap.getQuantidade())
                        .currencyId("BRL")
                        .unitPrice(pedido.getValorTotal())  // Se necessário, pode ser mais granular
                        .build())
                .collect(Collectors.toList());

        var preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .build();

        var client = new PreferenceClient();

        return client.create(preferenceRequest).getInitPoint(); // URL do checkout Mercado Pago
    }
}
