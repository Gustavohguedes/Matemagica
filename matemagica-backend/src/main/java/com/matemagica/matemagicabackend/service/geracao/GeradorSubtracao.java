package com.matemagica.matemagicabackend.service.geracao;

import com.matemagica.matemagicabackend.model.RegraGeracao;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GeradorSubtracao implements GeradorDePergunta{

    private static final Random RANDOM = new Random();

    @Override
    public Map<String, Object> gerar(RegraGeracao regra) {
        Map<String, Object> parametros = regra.getParametros();

        int min = (int) parametros.get("min");
        int max = (int) parametros.get("max");

        //sorteia o minueno (maior) e o subtraendo (menor), garantino resultado >= 0
        int minueno = min + RANDOM.nextInt(max - min + 1);
        int subtraeno = RANDOM.nextInt(minueno + 1);
        int respotaCorreta = minueno - subtraeno;

        List<Integer> alternativas = gerarAlternativas(respotaCorreta);

        Map<String, Object> dados = new HashMap<>();
        dados.put("minueno", minueno);
        dados.put("subtraeno", subtraeno);
        dados.put("alternativas", alternativas);
        dados.put("resposta_correta", respotaCorreta);

        return dados;
    }

    private List<Integer> gerarAlternativas(int respostaCorreta) {
        Set<Integer> alternativas = new LinkedHashSet<>();
        alternativas.add(respostaCorreta);

        while (alternativas.size() < 4) {
            int distorcao = RANDOM.nextInt(7) - 3;
            int candidato = respostaCorreta + distorcao;
            if(candidato >= 0 && distorcao != 0) {
                alternativas.add(candidato);
            }
        }

        List<Integer> resultado = new ArrayList<>(alternativas);
        Collections.shuffle(resultado);
        return resultado;
    }

    @Override
    public String getTipoAtividade() {
        return "subtracao";
    }
}
