package com.msanunciospedidos.autotech.app.repository;

import com.msanunciospedidos.autotech.app.domain.PedidoDomainEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<PedidoDomainEntity, Long> {
}
