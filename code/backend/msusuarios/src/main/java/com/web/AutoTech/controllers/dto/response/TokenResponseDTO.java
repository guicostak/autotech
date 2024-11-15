package com.web.AutoTech.controllers.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;
import java.util.UUID;

public class TokenResponseDTO {

    @JsonProperty("access_token")
    private String token;

    @JsonProperty("refresh_token")
    private UUID refreshToken;

    @JsonProperty("name")
    private String name;

    @JsonProperty("id")
    private Long id;

    @JsonProperty("email")
    private String email;

    @JsonProperty("expires")
    private long expirationTimestamp;

    public TokenResponseDTO(String token,
                            String name,
                            Long id,
                            UUID refreshToken,
                            String email,
                            Date expirationDate
    ) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.refreshToken = refreshToken;
        this.email = email;
        this.expirationTimestamp = expirationDate.getTime();
    }

}
