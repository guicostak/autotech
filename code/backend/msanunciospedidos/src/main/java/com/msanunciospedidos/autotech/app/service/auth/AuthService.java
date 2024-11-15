package com.msanunciospedidos.autotech.app.service.auth;

import com.msanunciospedidos.autotech.app.exception.UserNotAuthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Enumeration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RestTemplate restTemplate;

    public void authenticateUser(Long userId, HttpServletRequest request) throws UserNotAuthorizedException {
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();

        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            headers.add(headerName, headerValue);
        }

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "http://localhost:8080/api/usuarios/{userId}",
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    String.class,
                    userId
            );

            if (!response.getStatusCode().equals(HttpStatus.OK)) {
                throw new UserNotAuthorizedException("Ação não autorizada para esse usuário");
            }

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new UserNotAuthorizedException("Erro na comunicação com o servidor: " + e.getMessage());
        } catch (Exception e) {
            throw new UserNotAuthorizedException("Erro inesperado: " + e.getMessage());
        }
    }
}
