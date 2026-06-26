package com.matemagica.matemagicabackend.service;

import com.matemagica.matemagicabackend.model.RegraGeracao;
import com.matemagica.matemagicabackend.service.geracao.GeradorDePergunta;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class GeracaoPerguntaService {

    private final Map<String, GeradorDePergunta> geradoresPorTipo;

    public GeracaoPerguntaService(List<GeradorDePergunta> geradores) {
        this.geradoresPorTipo = geradores.stream()
                .collect(Collectors.toMap(
                        GeradorDePergunta::getTipoAtividade,
                        Function.identity()
                ));
    }

    public Map<String, Object> gerarPergunta(RegraGeracao regra) {
        String tipo = regra.getAtividade().getTipo();
        GeradorDePergunta gerador = geradoresPorTipo.get(tipo);

        if(gerador == null) {
            throw new IllegalStateException(
                    "Nenhum gerador para o tipo de atividade " + tipo
            );
        }

        return gerador.gerar(regra);
    }
}
