package com.matemagica.matemagicabackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "recompensa_conquistada",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_recompensa_conquistada_perfil",
                columnNames = {"perfil_id", "recompensa_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecompensaConquistada {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    private PerfilCrianca perfil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recompensa_id", nullable = false)
    private Recompensa recompensa;

    @Column(name = "conquistada_em", nullable = false, updatable = false)
    private OffsetDateTime conquistadaEm;

    @PrePersist
    protected void onCreate() {
        if (conquistadaEm == null) {
            conquistadaEm = OffsetDateTime.now();
        }
    }
}