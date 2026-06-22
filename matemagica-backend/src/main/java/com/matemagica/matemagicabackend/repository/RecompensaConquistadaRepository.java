package com.matemagica.matemagicabackend.repository;

import com.matemagica.matemagicabackend.model.RecompensaConquistada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecompensaConquistadaRepository extends JpaRepository<RecompensaConquistada, UUID> {

    List<RecompensaConquistada> findByperfilId(UUID perfilId);

    boolean existsByPerfilIdAndRecompensaId(UUID perfilId, UUID recompensaId);
}
