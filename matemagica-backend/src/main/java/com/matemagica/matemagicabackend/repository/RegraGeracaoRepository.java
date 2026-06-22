package com.matemagica.matemagicabackend.repository;

import com.matemagica.matemagicabackend.model.RegraGeracao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RegraGeracaoRepository extends JpaRepository<RegraGeracao, UUID> {

    List<RegraGeracao> findByAtividadeIdAndNivelDificuldadeAndAtivoTrue(
            UUID atividadeId,
            String nivelDificuldade
    );
}
