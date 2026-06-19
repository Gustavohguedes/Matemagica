package com.matemagica.matemagicabackend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "perfil_crianca")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PerfilCrianca {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome_exibicao", nullable = false, length = 50)
    private String nomeExibicao;

    @Column(name = "nivel_dificuldade_atual", nullable = false, length = 10)
    private String nivelDificuldadeAtual = "facil";

    @Column(name = "total_estrelas", nullable = false)
    private int totalEstrelas = 0;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        if(criadoEm == null) {
            criadoEm = OffsetDateTime.now();
        }
    }

}
