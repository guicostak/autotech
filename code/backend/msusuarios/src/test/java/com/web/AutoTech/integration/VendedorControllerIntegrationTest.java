package com.web.AutoTech.integration;

import com.web.AutoTech.controllers.dto.request.CompleteAddressRequestDTO;
import com.web.AutoTech.controllers.dto.request.VendedorCreateRequestDTO;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class VendedorControllerIntegrationTest {

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
    public void testGetVendedorByUsuarioId_Success() {
        long usuarioId = 1L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .get(buildEndpoint("/api/vendedores/" + usuarioId))
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("usuarioId", equalTo((int) usuarioId))
                .log().ifError();
    }

    @Test
    public void testGetVendedorByUsuarioId_NotFound() {
        long usuarioId = 999L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .get(buildEndpoint("/api/vendedores/" + usuarioId))
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .body(either(isEmptyString()).or(nullValue()))
                .log().ifError();
    }

    @Test
    public void testCreateVendedor_Success() {
        long usuarioId = 1L;
        final var request = new VendedorCreateRequestDTO()
                .setUsuarioId(40L)
                .setNomeFantasia("Lojinha do João")
                .setCnpj("43.305.847/0001-97")
                .setEmailEmpresa("lojinhadojoao@gmail.com")
                .setDescricao("Empresa destinada a vender muambas.")
                .setTelefoneEmpresa("31983657891")
                .setImagemPerfil("joao.png")
                .setClassificacaoVendedor(1);

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post(buildEndpoint("/api/vendedores/" + usuarioId))
                .then()
                .statusCode(HttpStatus.CREATED.value())
                .log().ifError();
    }

    @Test
    public void testCreateVendedor_UserNotFound() {
        long usuarioId = 999L;

        final var request = new VendedorCreateRequestDTO()
                .setUsuarioId(40L)
                .setNomeFantasia("Lojinha do João")
                .setCnpj("43.305.847/0001-97")
                .setEmailEmpresa("lojinhadojoao@gmail.com")
                .setDescricao("Empresa destinada a vender muambas.")
                .setTelefoneEmpresa("31983657891")
                .setImagemPerfil("joao.png")
                .setClassificacaoVendedor(1);

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post(buildEndpoint("/api/vendedores/" + usuarioId))
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .body(equalTo("Usuário não encontrado"))
                .log().ifError();
    }

    @Test
    public void testUpdateVendedorByUsuarioId_Success() {
        long usuarioId = 1L;

        final var request = new VendedorCreateRequestDTO()
                .setUsuarioId(40L)
                .setNomeFantasia("Lojinha do João")
                .setCnpj("43.305.847/0001-97")
                .setEmailEmpresa("lojinhadojoao@gmail.com")
                .setDescricao("Empresa destinada a vender muambas.")
                .setTelefoneEmpresa("31983657891")
                .setImagemPerfil("joao.png")
                .setClassificacaoVendedor(1);

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .put(buildEndpoint("/api/vendedores/" + usuarioId))
                .then()
                .statusCode(HttpStatus.OK.value())
                .log().ifError();
    }

    @Test
    public void testDeleteVendedor_Success() {
        long vendedorId = 2L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .delete(buildEndpoint("/api/vendedores/" + vendedorId))
                .then()
                .statusCode(HttpStatus.NO_CONTENT.value())
                .log().ifError();
    }

    @Test
    public void testDeleteVendedor_NotFound() {
        long vendedorId = 999L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .delete(buildEndpoint("/api/vendedores/" + vendedorId))
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .log().ifError();
    }

    @Test
    public void testPreencherEndereco_Success() {
        long usuarioId = 1L;

        final var request = new CompleteAddressRequestDTO()
                .setCep("12345678")
                .setEstado("SP")
                .setCidade("São Paulo")
                .setRua("Rua Exemplo")
                .setNumero("100")
                .setBairro("Centro")
                .setComplemento("Apt 101");

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post(buildEndpoint("/api/vendedores/endereco/" + usuarioId))
                .then()
                .statusCode(HttpStatus.NO_CONTENT.value())
                .log().ifError();
    }

    @Test
    public void testPreencherEndereco_NotFound() {
        long usuarioId = 999L;

        final var request = new CompleteAddressRequestDTO()
                .setCep("12345678")
                .setEstado("SP")
                .setCidade("São Paulo")
                .setRua("Rua Exemplo")
                .setNumero("100")
                .setBairro("Centro")
                .setComplemento("Apt 101");

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post(buildEndpoint("/api/vendedores/endereco/" + usuarioId))
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .log().ifError();
    }

    @Test
    public void testAtualizarEndereco_Success() {

        long usuarioId = 1L;

        final var request = new CompleteAddressRequestDTO()
                .setCep("12345678")
                .setEstado("SP")
                .setCidade("São Paulo")
                .setRua("Rua Exemplo")
                .setNumero("100")
                .setBairro("Centro")
                .setComplemento("Apt 101");

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .patch(buildEndpoint("/api/vendedores/endereco/" + usuarioId))
                .then()
                .statusCode(HttpStatus.NO_CONTENT.value())
                .log().ifError();
    }

    @Test
    public void testAtualizarEndereco_NotFound() {

        long usuarioId = 999L;

        final var request = new CompleteAddressRequestDTO()
                .setCep("12345678")
                .setEstado("SP")
                .setCidade("São Paulo")
                .setRua("Rua Exemplo")
                .setNumero("100")
                .setBairro("Centro")
                .setComplemento("Apt 101");

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .patch(buildEndpoint("/api/vendedores/endereco/" + usuarioId))
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .log().ifError();
    }
}

