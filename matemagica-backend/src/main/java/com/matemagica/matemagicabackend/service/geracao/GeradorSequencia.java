package com.matemagica.matemagicabackend.service.geracao;

import com.matemagica.matemagicabackend.model.RegraGeracao;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GeradorSequencia implements GeradorDePergunta{

    private static final Random RANDOM = new Random();

    @Override
    public Map<String, Object> gerar(RegraGeracao regra) {
        Map<String, Object> parametros = regra.getParametros();

        int passo = (int) parametros.get("passo");
        int min = (int) parametros.get("min");
        int max = (int) parametros.get("max");
        int qtdNumerosVissiveis = 4; // Ex: 4, 5, 6, 7 ->  e o "?" é o 5°


        //sorteia um ponto de partidada que ainda deixa um espaço em branco para a sequencia
        int limiteSuperior = max - (passo * qtdNumerosVissiveis);
        int inicio = min + RANDOM.nextInt(Math.max(1, limiteSuperior-min));


        List<Integer> sequenciaVissivel = new ArrayList<>();
        for (int i = 0; i < qtdNumerosVissiveis; i++) {
            sequenciaVissivel.add(inicio + (i * passo));
        }

        int respostaCoreta = inicio + (qtdNumerosVissiveis * passo);

        List<Integer> alternativas = gerarAlternativas(respostaCoreta, passo);

        Map<String, Object> dados = new HashMap<>();
        dados.put("sequencia", sequenciaVissivel);
        dados.put("alternativas", alternativas);
        dados.put("resposta_correta", respostaCoreta);

        return dados;
    }

    private List<Integer> gerarAlternativas(int respostaCorreta, int passo) {

        Set<Integer> alternativas = new LinkedHashSet<>();
        alternativas.add(respostaCorreta);

        //Gera 3 respostas erradas proximas da correta sem repetir
        while (alternativas.size() < 4){
            int distorcao = RANDOM.nextInt(passo * 4) - (passo * 2);
            int candidato = respostaCorreta + distorcao;
            if(candidato > 0){
                alternativas.add(candidato);
            }
        }

        List<Integer> resultados = new ArrayList<>(alternativas);
        Collections.shuffle(resultados);

        return resultados;
    }

    @Override
    public String getTipoAtividade() {
        return "sequencia";
    }
}
