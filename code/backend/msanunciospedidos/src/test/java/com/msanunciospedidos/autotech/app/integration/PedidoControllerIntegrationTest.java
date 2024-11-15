package com.msanunciospedidos.autotech.app.integration;

import com.msanunciospedidos.autotech.app.controller.dto.request.AnuncioPedidoDTO;
import com.msanunciospedidos.autotech.app.controller.dto.request.PedidoRequestDTO;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PedidoControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @BeforeAll
    public static void setup() {
        RestAssured.baseURI = "http://localhost";
    }

    private String buildEndpoint() {
        return "http://localhost:" + port + "/api/pedidos";
    }

    @Test
    public void testCriarPedido_Success() {
        final var pedidoRequest = new PedidoRequestDTO()
                .setUsuarioId(1L)
                .setAnuncios(List.of(
                        new AnuncioPedidoDTO().setAnuncioId(100L).setQuantidade(2),
                        new AnuncioPedidoDTO().setAnuncioId(101L).setQuantidade(1)
                ));

        given()
                .contentType(ContentType.JSON)
                .body(pedidoRequest)
                .when()
                .post(buildEndpoint())
                .then()
                .statusCode(HttpStatus.CREATED.value())
                .body("id", notNullValue())
                .body("status", equalTo("CREATED"))
                .log().ifError();
    }

    @Test
    public void testCriarPedido_BadRequest() {
        final var pedidoRequest = new PedidoRequestDTO()
                .setUsuarioId(1L)
                .setAnuncios(List.of(
                        new AnuncioPedidoDTO().setAnuncioId(100L).setQuantidade(0) // quantidade inválida
                ));

        given()
                .contentType(ContentType.JSON)
                .body(pedidoRequest)
                .when()
                .post(buildEndpoint())
                .then()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .body("message", containsString("quantidade must be greater than or equal to 1"))
                .log().ifError();
    }

    @Test
    public void testCriarPedido_InternalServerError() {
        final var pedidoRequest = new PedidoRequestDTO()
                .setUsuarioId(1L)
                .setAnuncios(List.of(
                        new AnuncioPedidoDTO().setAnuncioId(-1L).setQuantidade(1)
                ));

        given()
                .contentType(ContentType.JSON)
                .body(pedidoRequest)
                .when()
                .post(buildEndpoint())
                .then()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .log().ifError();
    }
}

