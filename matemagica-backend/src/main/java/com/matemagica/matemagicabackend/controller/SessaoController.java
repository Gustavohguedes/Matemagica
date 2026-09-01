package com.matemagica.matemagicabackend.controller;

import com.matemagica.matemagicabackend.model.*;
import com.matemagica.matemagicabackend.repository.*;
import com.matemagica.matemagicabackend.service.GeracaoPerguntaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/sessoes")
public class SessaoController {

    private final SessaoRepository sessaoRepository;
    private final TentativaRepository tentativaRepository;
    private final PerfilCriancaRepository perfilCriancaRepository;
    private final AtividadeRepository atividadeRepository;
    private final RegraGeracaoRepository regraGeracaoRepository;
    private final GeracaoPerguntaService geracaoPerguntaService;

    public SessaoController(
            SessaoRepository sessaoRepository,
            TentativaRepository tentativaRepository,
            PerfilCriancaRepository perfilCriancaRepository,
            AtividadeRepository atividadeRepository,
            RegraGeracaoRepository regraGeracaoRepository,
            GeracaoPerguntaService geracaoPerguntaService
    ) {
        this.sessaoRepository = sessaoRepository;
        this.tentativaRepository = tentativaRepository;
        this.perfilCriancaRepository = perfilCriancaRepository;
        this.atividadeRepository = atividadeRepository;
        this.regraGeracaoRepository = regraGeracaoRepository;
        this.geracaoPerguntaService = geracaoPerguntaService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> iniciar(@RequestBody Map<String, String> body) {
        UUID perfilId = UUID.fromString(body.get("perfilId"));
        PerfilCrianca perfil = perfilCriancaRepository.findById(perfilId).orElseThrow(() -> new RuntimeException("Perfil não encontrado: " + perfilId));

        UUID atividadeId = UUID.fromString(body.get("atividadeId"));
        Atividade atividade = atividadeRepository.findById(atividadeId).orElseThrow(() -> new RuntimeException("Atividade não encontrada: " + atividadeId));

        String nivel = body.getOrDefault("nivelDificuldade", perfil.getNivelDificuldadeAtual());

        List<RegraGeracao> regras = regraGeracaoRepository.findByAtividadeIdAndNivelDificuldadeAndAtivoTrue(atividadeId, nivel);

        if (regras.isEmpty()) {
            throw new RuntimeException("Nenhuma regra de geração encontrada para: " + atividade.getTipo() + " / " + nivel);
        }

        Sessao sessao = new Sessao();
        sessao.setPerfil(perfil);
        sessao.setAtividade(atividade);
        sessao.setNivelDificuldade(nivel);
        sessao.setTotalPerguntas(8);
        sessaoRepository.save(sessao);

        Random random = new Random();
        List<Map<String, Object>> perguntas = new ArrayList<>();

        for (int i = 1; i < 9; i++) {
            RegraGeracao regra = regras.get(random.nextInt(regras.size()));

            Map<String, Object> dadosPerguntas = geracaoPerguntaService.gerarPergunta(regra);

            Tentativa tentativa = new Tentativa();
            tentativa.setSessao(sessao);
            tentativa.setRegraGeracao(regra);
            tentativa.setNumeroOrdem(i);
            tentativa.setDadosPerguntasGeradas(dadosPerguntas);
            tentativaRepository.save(tentativa);

            Map<String, Object> perguntaResposta = new LinkedHashMap<>();
            perguntaResposta.put("tentativaId", tentativa.getId());
            perguntaResposta.put("numeroOrdem",i);
            perguntaResposta.put("dados", dadosPerguntas);
            perguntas.add(perguntaResposta);
        }

        Map<String, Object> resposta = new LinkedHashMap<>();
        resposta.put("sessaoId", sessao.getId());
        resposta.put("atividade", atividade.getTipo());
        resposta.put("nivelDificuldade", nivel);
        resposta.put("totalPerguntas", 8);
        resposta.put("perguntas", perguntas);

        return ResponseEntity.ok(resposta);
    }
}
