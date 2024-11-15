package com.web.AutoTech.services.autenticacao;


import com.web.AutoTech.repositories.UsuarioDomainEntityRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioDomainEntityRepository usuarioDomainEntityRepository;

    public CustomUserDetailsService(UsuarioDomainEntityRepository usuarioDomainEntityRepository) {
        this.usuarioDomainEntityRepository = usuarioDomainEntityRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.usuarioDomainEntityRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario: " + username + " nao encontrado"));
    }
}
