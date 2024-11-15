package com.web.AutoTech.controllers.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {

    @JsonProperty("email")
    private String email;
    @JsonProperty("password")
    private String password;
}
