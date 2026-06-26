package com.matemagica.matemagicabackend.service.geracao;

import com.matemagica.matemagicabackend.model.RegraGeracao;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GeradorAdicao implements GeradorDePergunta{

    private static final Random RANDOM = new Random();

    @Override
    public Map<String, Object> gerar(RegraGeracao regra) {
        Map<String, Object> parametros = regra.getParametros();

        int min = (int) parametros.get("min");
        int max = (int) parametros.get("max");

        int parcela1 = min + RANDOM.nextInt(max - min + 1);
        int parcela2 = min + RANDOM.nextInt(max - min +1);
        int respostaCorreta = parcela1 + parcela2;

        List<Integer> alternativas = gerarAlternativas(respostaCorreta);
        Map<String, Object> dados = new HashMap<>();
        dados.put("parcela1", parcela1);
        dados.put("parcela2", parcela2);
        dados.put("alternativas", alternativas);
        dados.put("resposta_correta", respostaCorreta);
        return dados;
    }

    private List<Integer> gerarAlternativas(int respostaCorreta) {
        Set<Integer> alternativas = new LinkedHashSet<>();
        alternativas.add(respostaCorreta);

        while (alternativas.size() < 4) {
            int distorcao = RANDOM.nextInt(7) - 3; // entre -3 e +3
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
        return "adicao";
    }
}
