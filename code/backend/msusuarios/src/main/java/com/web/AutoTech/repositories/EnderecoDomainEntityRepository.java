package com.web.AutoTech.repositories;

import com.web.AutoTech.domain.EnderecoDomainEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnderecoDomainEntityRepository extends JpaRepository<EnderecoDomainEntity, Long> {
   
}
