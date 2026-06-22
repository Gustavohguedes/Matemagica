package com.matemagica.matemagicabackend.repository;

import com.matemagica.matemagicabackend.model.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AtividadeRepository extends JpaRepository<Atividade, UUID> {


    Optional<Atividade> findByTipo(String tipo);
}
