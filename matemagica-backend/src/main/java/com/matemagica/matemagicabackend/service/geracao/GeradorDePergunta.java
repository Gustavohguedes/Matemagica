package com.matemagica.matemagicabackend.service.geracao;

import com.matemagica.matemagicabackend.model.RegraGeracao;

import java.util.Map;


public interface GeradorDePergunta {

    /**
        gerar os dados para uma pergunta com base nos parâmetros da regra
        o retorno é o Map que sera salvo em Tentativa.dadosPerguntasGerada
    **/
    Map<String, Object>gerar(RegraGeracao regra);

    /**
     * Indica para qual tipo de atividade esse gerador serve
     * Usado para o spring escolher o gerador certo em tempo de execução
     **/
    String getTipoAtividade();
}
