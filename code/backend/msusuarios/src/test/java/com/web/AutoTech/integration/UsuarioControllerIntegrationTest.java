package com.web.AutoTech.integration;

import com.web.AutoTech.controllers.dto.request.ResendEmailRequestDTO;
import com.web.AutoTech.controllers.dto.request.UsuarioCreateRequestDTO;
import com.web.AutoTech.controllers.dto.request.UsuarioUpdateRequestDTO;
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
public class UsuarioControllerIntegrationTest {

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
    public void testCreateUser_Success() {
        final var request = new UsuarioCreateRequestDTO()
                .setNome("João")
                .setEmail("joao@gmail.com")
                .setPassword("12345678")
                .setCpf("13911365677");

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post(buildEndpoint("/api/usuarios"))
                .then()
                .statusCode(HttpStatus.CREATED.value())
                .log().ifError();
    }

    @Test
    public void testGetUserById_Success() {
        long userId = 1L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .get(buildEndpoint("/api/usuarios/" + userId))
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("id", equalTo((int) userId))
                .log().ifError();
    }

    @Test
    public void testGetUserById_NotFound() {
        long userId = 999L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .get(buildEndpoint("/api/usuarios/" + userId))
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .body(isEmptyOrNullString())
                .log().ifError();
    }

    @Test
    public void testUpdateUser_Success() {
        long userId = 1L;
        final var request = new UsuarioUpdateRequestDTO()
                .setNome("João")
                .setEmail("joao@gmail.com")
                .setCpf("13911365677")
                .setDataNascimento("2000-23-07")
                .setTelefone("31983647521");

        given()
                .contentType(ContentType.MULTIPART)
                .multiPart("request", request)
                .when()
                .put(buildEndpoint("/api/usuarios/" + userId))
                .then()
                .statusCode(HttpStatus.NO_CONTENT.value())
                .log().ifError();
    }

    @Test
    public void testDeleteUser_Success() {
        long userId = 2L;

        given()
                .contentType(ContentType.JSON)
                .when()
                .delete(buildEndpoint("/api/usuarios/" + userId))
                .then()
                .statusCode(HttpStatus.NO_CONTENT.value())
                .log().ifError();
    }

    @Test
    public void testConfirmEmail_Success() {
        final var token = "validToken123";

        given()
                .contentType(ContentType.JSON)
                .when()
                .get(buildEndpoint("/api/usuarios/confirmacao_email/" + token))
                .then()
                .statusCode(HttpStatus.OK.value())
                .body(equalTo("E-mail confirmado com sucesso."))
                .log().ifError();
    }

    @Test
    public void testConfirmEmail_InvalidToken() {
        final var token = "invalidToken123";

        given()
                .contentType(ContentType.JSON)
                .when()
                .get(buildEndpoint("/api/usuarios/confirmacao_email/" + token))
                .then()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .body(not(isEmptyOrNullString()))
                .log().ifError();
    }

    @Test
    public void testResendConfirmationEmail_Success() {
        final var request = new ResendEmailRequestDTO()
                .setEmail("joao@gmail.com");

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post(buildEndpoint("/api/usuarios/resend_confirmation"))
                .then()
                .statusCode(HttpStatus.OK.value())
                .body(equalTo("Novo link de confirmação enviado com sucesso."))
                .log().ifError();
    }

    @Test
    public void testResendConfirmationEmail_EmailNotFound() {
        final var request = new ResendEmailRequestDTO()
                .setEmail("joao@gmail.com");

        given()
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post(buildEndpoint("/api/usuarios/resend_confirmation"))
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .body(equalTo("E-mail não encontrado."))
                .log().ifError();
    }
}
