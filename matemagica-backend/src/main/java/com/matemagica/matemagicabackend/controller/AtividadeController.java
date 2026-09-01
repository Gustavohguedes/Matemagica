package com.matemagica.matemagicabackend.controller;

import com.matemagica.matemagicabackend.model.Atividade;
import com.matemagica.matemagicabackend.repository.AtividadeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/atividades")
public class AtividadeController {
    private final AtividadeRepository atividadeRepository;

    public AtividadeController(AtividadeRepository atividadeRepository) {
        this.atividadeRepository = atividadeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Atividade>> listar() {
        List<Atividade> atividades = atividadeRepository.findAll();
        return ResponseEntity.ok(atividades);
    }
}
