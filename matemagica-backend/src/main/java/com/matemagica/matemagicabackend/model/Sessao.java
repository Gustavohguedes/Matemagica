package com.matemagica.matemagicabackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "sessao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sessao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    private PerfilCrianca perfil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atividade_id", nullable = false)
    private Atividade atividade;

    @Column(name = "nivel_dificuldade", nullable = false, length = 10)
    private String nivelDificuldade;

    @Column(name = "total_perguntas", nullable = false)
    private int totalPerguntas = 8;

    @Column(name = "iniciada_em", nullable = false, updatable = false)
    private OffsetDateTime iniciadaEm;

    @Column(name = "finalizada_em")
    private OffsetDateTime finalizadaEm;

    @PrePersist
    protected void onCreate() {
        if (iniciadaEm == null) {
            iniciadaEm = OffsetDateTime.now();
        }
    }
}
