package com.matemagica.matemagicabackend.controller;

import com.matemagica.matemagicabackend.model.RegraGeracao;
import com.matemagica.matemagicabackend.repository.RegraGeracaoRepository;
import com.matemagica.matemagicabackend.service.GeracaoPerguntaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/regras-geracao")
public class RegraGeracaoController {


    private final RegraGeracaoRepository regraGeracaoRepository;
    private final GeracaoPerguntaService geracaoPerguntaService;

    public RegraGeracaoController(
            RegraGeracaoRepository regraGeracaoRepository,
            GeracaoPerguntaService geracaoPerguntaService
    ) {
        this.regraGeracaoRepository = regraGeracaoRepository;
        this.geracaoPerguntaService = geracaoPerguntaService;
    }

    @GetMapping("/{id}/gerar-pergunta")
    public ResponseEntity<Map<String, Object>> gerarPergunta(@PathVariable UUID id){
        RegraGeracao regra = regraGeracaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Regra de geração não encontrada: " + id));
        
        Map<String, Object> pergunta = geracaoPerguntaService.gerarPergunta(regra);

        return ResponseEntity.ok(pergunta);
    }
}
