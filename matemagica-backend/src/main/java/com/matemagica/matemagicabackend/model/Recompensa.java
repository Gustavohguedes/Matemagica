package com.matemagica.matemagicabackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "recompensa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recompensa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome", nullable = false, length = 80)
    private String name;

    @Column(name = "tipo", nullable = false, length = 20)
    private String tipo;

    @Column(name = "estrelas_necessarias", nullable = false)
    private int estrelasNecessarias = 0;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @PrePersist
    protected void onCreate(){
        if(criadoEm == null) {
            criadoEm = OffsetDateTime.now();
        }
    }
}
