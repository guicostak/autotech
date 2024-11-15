package com.msanunciospedidos.autotech.app.repository;

import com.msanunciospedidos.autotech.app.domain.AnuncioDomainEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AnuncioRepository extends JpaRepository<AnuncioDomainEntity, Long>,
        JpaSpecificationExecutor<AnuncioDomainEntity> {

    Page<AnuncioDomainEntity> findByUsuarioIdOrVendedorId(Long usuarioId,Long vendedorId, Pageable pageable);

}
