package com.msanunciospedidos.autotech.app.integration;

import com.msanunciospedidos.autotech.app.controller.dto.request.AlterarStatusAnuncioRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.request.AnuncioRequestDTO;
import com.msanunciospedidos.autotech.app.controller.dto.request.GetAnunciosPorListaIdsRequestDTO;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AnuncioControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @BeforeAll
    public static void setup() {
        RestAssured.baseURI = "http://localhost";
    }

    private String buildEndpoint(String path) {
        return "http://localhost:" + port + path;
    }

    @Test
    public void testCriarAnuncio_Success() {

        final var anuncioRequest = new AnuncioRequestDTO()
                .setAnuncianteId(123L)
                .setTitulo("Motor ford ka")
                .setModelo("Motor ford ka 1,6")
                .setDescricao("Motor em ótimo estado")
                .setMarca("Ford")
                .setCategoria("Motor")
                .setPreco(new BigDecimal("20000.00"))
                .setPessoaJuridica(false)
                .setQuantidadeProdutos(1)
                .setAnoFabricacao(2010)
                .setVendedor(true);

        List<MultipartFile> imagens = List.of(new MockMultipartFile(
                "file1",
                "image1.jpg",
                "image/jpeg", new byte[10]));

        given()
                .contentType(ContentType.MULTIPART)
                .multiPart("anuncio", anuncioRequest)
                .multiPart("imagens", imagens)
                .when()
                .post(buildEndpoint("/api/anuncios"))
                .then()
                .statusCode(HttpStatus.CREATED.value())
                .body(equalTo("Anúncio criado com sucesso!"))
                .log().ifError();
    }

    @Test
    public void testConsultarAnuncio_Success() {
        long anuncioId = 1L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .get(buildEndpoint("/api/anuncios/" + anuncioId))
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("id", equalTo((int) anuncioId))
                .log().ifError();
    }

    @Test
    public void testConsultarAnuncio_NotFound() {
        long anuncioId = 999L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .get(buildEndpoint("/api/anuncios/" + anuncioId))
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .log().ifError();
    }

    @Test
    public void testListarAnuncios_Success() {

        given()
                .contentType(ContentType.JSON)
                .queryParam("page", 0)
                .queryParam("size", 10)
                .when()
                .get(buildEndpoint("/api/anuncios"))
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("content", not(empty()))
                .log().ifError();
    }

    @Test
    public void testAlterarStatusAnuncio_Success() {
        long anuncioId = 1L;

        final var requestDTO = new AlterarStatusAnuncioRequestDTO()
                .setAtivo(true);

        given()
                .contentType(ContentType.JSON)
                .body(requestDTO)
                .when()
                .patch(buildEndpoint("/api/anuncios/" + anuncioId))
                .then()
                .statusCode(HttpStatus.NO_CONTENT.value())
                .log().ifError();
    }

    @Test
    public void testAlterarStatusAnuncio_Unauthorized() {
        long anuncioId = 1L;

        final var requestDTO = new AlterarStatusAnuncioRequestDTO()
                .setAtivo(true);

        given()
                .contentType(ContentType.JSON)
                .body(requestDTO)
                .when()
                .patch(buildEndpoint("/api/anuncios/" + anuncioId))
                .then()
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .log().ifError();
    }

    @Test
    public void testListarAnunciosPorUsuario_Success() {
        long usuarioId = 1L;

        given()
                .contentType(ContentType.JSON)
                .queryParam("page", 0)
                .queryParam("size", 10)
                .when()
                .get(buildEndpoint("/api/anuncios/usuarios/" + usuarioId))
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("content", not(empty()))
                .log().ifError();
    }

    @Test
    public void testListarAnunciosPorListaIds_Success() {
        final var requestDTO = new GetAnunciosPorListaIdsRequestDTO(List.of(1L, 2L, 3L));

        given()
                .contentType(ContentType.JSON)
                .body(requestDTO)
                .when()
                .post(buildEndpoint("/api/anuncios/listagem"))
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(greaterThan(0)))
                .log().ifError();
    }

    @Test
    public void testDeletarAnuncio_Success() {
        long anuncioId = 1L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .delete(buildEndpoint("/api/anuncios/" + anuncioId))
                .then()
                .statusCode(HttpStatus.OK.value())
                .body(equalTo("Anúncio excluído com sucesso"))
                .log().ifError();
    }

    @Test
    public void testDeletarAnuncio_NotFound() {

        long anuncioId = 999L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .delete(buildEndpoint("/api/anuncios/" + anuncioId))
                .then()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .body(not(isEmptyOrNullString()))
                .log().ifError();
    }
}

