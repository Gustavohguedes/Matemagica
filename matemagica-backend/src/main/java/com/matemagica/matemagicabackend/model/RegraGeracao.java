package com.matemagica.matemagicabackend.model;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "regra_geracao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegraGeracao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atividade_id", nullable = false)
    private Atividade atividade;

    @Column(name = "nivel_dificuldade", nullable = false, length = 10)
    private String nivelDificuldade;

    @Column(name = "tipo_padrao", nullable = false, length = 30)
    private String tipoPadrao;

    @Type(JsonBinaryType.class)
    @Column(name = "parametros", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> parametros;

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
