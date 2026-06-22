package com.matemagica.matemagicabackend.repository;

import com.matemagica.matemagicabackend.model.Recompensa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecompensaRepository extends JpaRepository<Recompensa, UUID> {

    List<Recompensa> findByAtivoTrueOrderByEstrelasNecessariasAsc();
}
