package com.msanunciospedidos.autotech.app.repository;

import com.msanunciospedidos.autotech.app.domain.UsuarioDomainEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<UsuarioDomainEntity, Long> {
}
