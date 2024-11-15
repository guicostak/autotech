package com.web.AutoTech.controllers.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ResetPasswordRequestDTO {

    @JsonProperty("token")
    private String token;

    @JsonProperty("senha")
    private String novaSenha;
}
