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
@Table(name = "tentativa",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_tentativa_sessao_ordem",
                columnNames = {"sessao_id", "numero_ordem"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tentativa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sessao_id", nullable = false)
    private Sessao sessao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regra_geracao_id", nullable = false)
    private RegraGeracao regraGeracao;

    @Column(name = "numero_ordem", nullable = false)
    private int numeroOrdem;

    @Type(JsonBinaryType.class)
    @Column(name = "dados_pergunta_gerada", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> dadosPerguntasGeradas;

    @Column(name = "resposta_dada", length = 50)
    private String respostaDada;

    @Column(name = "correta")
    private boolean correta;

    @Column(name = "tempo_resposta_ms")
    private Integer tempoRespostaMs;

    @Column(name = "respondida_em")
    private OffsetDateTime respondidaEm;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @PrePersist
    protected void onCreate(){
        if (criadoEm == null) {
            criadoEm = OffsetDateTime.now();
        }
    }
}
