package com.web.AutoTech.repositories;

import com.web.AutoTech.domain.VendedorDomainEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendedorDomainEntityRepository extends JpaRepository<VendedorDomainEntity, Long> {
   
    boolean existsUserByCnpj(String cnpj);

    boolean existsUserByEmailEmpresa(String emailEmpresa);

    Optional<VendedorDomainEntity> findByUsuarioId(Long usuarioId);

}
