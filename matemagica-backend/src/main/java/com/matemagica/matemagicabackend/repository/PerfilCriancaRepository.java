package com.matemagica.matemagicabackend.repository;

import com.matemagica.matemagicabackend.model.PerfilCrianca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PerfilCriancaRepository extends JpaRepository<PerfilCrianca, UUID> {

    List<PerfilCrianca> findByAtivoTrue();
}
