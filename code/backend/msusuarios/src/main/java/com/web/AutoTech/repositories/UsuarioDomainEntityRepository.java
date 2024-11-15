package com.web.AutoTech.repositories;

import com.web.AutoTech.domain.UsuarioDomainEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Repository
public interface UsuarioDomainEntityRepository extends JpaRepository<UsuarioDomainEntity, Long> {

    @Transactional(readOnly = true)
    Optional<UsuarioDomainEntity> findByEmail(String email);

    boolean existsUserByEmailOrCpf(String email, String cpf);

    boolean existsUserByCpf(String cpf);

    Optional<UsuarioDomainEntity> findByConfirmationToken(String confirmationToken);
}
