package com.msanunciospedidos.autotech.app.repository;

import com.msanunciospedidos.autotech.app.domain.VendedorDomainEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendedorDomainEntityRepository extends JpaRepository<VendedorDomainEntity, Long> {

    Optional<VendedorDomainEntity> findByUsuarioId(Long usuarioId);

}
