package com.matemagica.matemagicabackend.service.geracao;

import com.matemagica.matemagicabackend.model.RegraGeracao;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GeradorContagem implements GeradorDePergunta{

    private static final Random RANDOM = new Random();
    private static final List<String> EMOJIS_DISPONIVEIS = List.of("🍎", "⭐", "🐶", "🚗", "🎈");

    @Override
    public Map<String, Object> gerar(RegraGeracao regra) {
        Map<String, Object> parametros = regra.getParametros();

        int min = (int) parametros.get("min");
        int max = (int) parametros.get("max");

        int quantidade = min + RANDOM.nextInt(max - min + 1);
        String emoji = EMOJIS_DISPONIVEIS.get(RANDOM.nextInt(EMOJIS_DISPONIVEIS.size()));

        List<Integer> alternativas = gerarAlternativas(quantidade, min, max);

        Map<String, Object> dados = new HashMap<>();
        dados.put("emoji", emoji);
        dados.put("quantidade_exibida", quantidade);
        dados.put("alternativas", alternativas);
        dados.put("resposta_correta", quantidade);

        return dados;
    }

    private List<Integer> gerarAlternativas(int respostaCorreta, int min, int max) {
        Set<Integer> alternativas = new LinkedHashSet<>();
        alternativas.add(respostaCorreta);

        while (alternativas.size() < 4) {
            int distorcao = RANDOM.nextInt(5) - 2; // entre -2 e +2
            int candidato = respostaCorreta + distorcao;
            if(candidato >= min && candidato <= max && distorcao != 0) {
                alternativas.add(candidato);
            }
        }

        List<Integer> resultado = new ArrayList<>(alternativas);
        Collections.shuffle(resultado);
        return resultado;
    }

    @Override
    public String getTipoAtividade() {
        return "contagem";
    }
}
