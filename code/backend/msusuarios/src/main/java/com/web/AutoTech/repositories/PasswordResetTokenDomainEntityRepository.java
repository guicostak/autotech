package com.web.AutoTech.repositories;

import com.web.AutoTech.domain.PasswordResetTokenDomainEntity;
import com.web.AutoTech.domain.UsuarioDomainEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenDomainEntityRepository extends JpaRepository<PasswordResetTokenDomainEntity, Long> {

    Optional<PasswordResetTokenDomainEntity> findByToken(String token);

    Optional<PasswordResetTokenDomainEntity> findByUsuarioEmail(String email);

    Optional<PasswordResetTokenDomainEntity> findByUsuario(UsuarioDomainEntity userId);
}
