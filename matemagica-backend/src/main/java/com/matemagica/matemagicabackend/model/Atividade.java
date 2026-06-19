package com.matemagica.matemagicabackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;


@Entity
@Table(name = "atividade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tipo", nullable = false, unique = true, length = 35)
    private String tipo;

    @Column(name = "descricao", nullable = false, length = 255)
    private String descicao;

    @Column(name = "ativo", nullable = false)
    private boolean ativo;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criado_em;

    @PrePersist
    protected void onCreate() {
        if(criado_em == null) {
            criado_em = OffsetDateTime.now();
        }
    }
}
