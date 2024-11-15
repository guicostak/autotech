package com.web.AutoTech.domain.enums;

import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum PerfilEnum {

    ADMIN(1, "ROLE_ADMIN"),
    USUARIO(2, "ROLE_USUARIO");

    private Integer code;
    private String descricao;

    public static PerfilEnum toEnum(Integer code) {
        if (Objects.isNull(code))
            return null;

        for (PerfilEnum x : PerfilEnum.values()) {
            if (code.equals(x.getCode()))
                return x;
        }

        throw new IllegalArgumentException("Invalid code: " + code);
    }

}
