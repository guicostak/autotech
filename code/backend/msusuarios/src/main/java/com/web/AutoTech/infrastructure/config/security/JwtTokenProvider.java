package com.web.AutoTech.infrastructure.config.security;

import com.web.AutoTech.exceptions.InvalidJwtAuthenticationException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private final UserDetailsService userDetailsService;

    private final String secretKey;

    public JwtTokenProvider(UserDetailsService userDetailsService, @Value("${app.secret.key}") String secretKey) {
        this.userDetailsService = userDetailsService;
        this.secretKey = secretKey;
    }

    public String createToken(String username, Collection<? extends GrantedAuthority> authorities) {
        Date now = new Date();
        // 2 dias
        long validityInMilliseconds = 172800000;
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        String data = username + ";" + validity.getTime() + ";" +
                authorities.stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.joining(","));

        String signature = generateHmac(data, secretKey);
        return Base64.getEncoder().encodeToString((data + "." + signature).getBytes(StandardCharsets.UTF_8));
    }

    public Authentication getAuthentication(String token) {
        String username = getUsername(token);
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    public String getUsername(String token) {
        String data = parseToken(token)[0];
        return data.split(";")[0];
    }

    public String parseData(String[] parts) {
        StringBuilder data = new StringBuilder();

        if (parts.length > 0) {
            data.append(parts[0]);
        }
        if (parts.length > 1) {
            data.append(";").append(parts[1]);
        }
        if (parts.length > 2) {
            data.append(";").append(parts[2]);
        }

        return data.toString(); // Retorna a string resultante
    }

    public boolean validateToken(String token) throws InvalidJwtAuthenticationException {
        try {
            String[] parts = parseToken(token);
            String data = parseData(parts);
            String signature = parts[3];

            if (!generateHmac(data, secretKey).equals(signature)) {
                throw new InvalidJwtAuthenticationException("Invalid token signature");
            }

            long expirationTime = Long.parseLong(data.split(";")[1]);
            if (new Date().getTime() > expirationTime) {
                throw new InvalidJwtAuthenticationException("Token expired");
            }

            return true;
        } catch (Exception e) {
            throw new InvalidJwtAuthenticationException("Expired or invalid token");
        }
    }

    public String resolveToken(HttpServletRequest req) {
        String bearerToken = req.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public Date getExpirationDate(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Token inválido");
        }

        String decodedToken = new String(Base64.getDecoder().decode(token));

        String[] parts = decodedToken.split(";");

        if (parts.length < 1) {
            throw new IllegalArgumentException("Token mal formado");
        }

        try {
            long expirationTime = Long.parseLong(parts[1]);
            return new Date(expirationTime);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Erro ao analisar a data de expiração: " + e.getMessage());
        }
    }

    private String[] parseToken(String token) {
        String decodedToken = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);

        String[] parts = decodedToken.split(";");

        if (parts.length > 0) {
            String[] lastPartSplit = parts[parts.length - 1].split("\\.");
            String[] result = new String[parts.length - 1 + lastPartSplit.length];
            System.arraycopy(parts, 0, result, 0, parts.length - 1);
            System.arraycopy(lastPartSplit, 0, result, parts.length - 1, lastPartSplit.length);

            return result;
        }

        return new String[0];
    }


    private String generateHmac(String data, String secretKey) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hmac);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC", e);
        }
    }
}
