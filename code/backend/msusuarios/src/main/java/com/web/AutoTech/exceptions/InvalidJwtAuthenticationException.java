package com.web.AutoTech.exceptions;

import javax.naming.AuthenticationException;

public class InvalidJwtAuthenticationException extends AuthenticationException {

    public InvalidJwtAuthenticationException(String s){
        super(s);
    }
}
