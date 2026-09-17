import { useEstrelas } from "@/context/EstrelasContext";
import { ResultadoPergunta } from "@/models/ResultadoPergunta";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// --- Types -------------------------

type Nivel = "nivel 1" | "nivel 2" | "nivel 3";

interface Pergunta {
  alternativas: number[];
  respostaCorreta: number;

  // contagem
  emoji?: string;
  quantidadeExibida?: number;

  // adicao
  parcela1?: number;
  parcela2?: number;

  // subtracao
  minuendo?: number;
  subtraendo?: number;

  // sequencia
  sequencia?: number[];
}

// --- Config Visual por type -----------------------

const CONFIG: Record<
  string,
  {
    titulo: string;
    emoji: string;
    cor: string;
    corClara: string;
  }
> = {
  contagem: {
    titulo: "Contagem",
    emoji: "🔢",
    cor: "#6366F1",
    corClara: "#E8E4FF",
  },

  adicao: {
    titulo: "Adição",
    emoji: "➕",
    cor: "#10B981",
    corClara: "#D6F5EC",
  },

  subtracao: {
    titulo: "Subtração",
    emoji: "➖",
    cor: "#EF4444",
    corClara: "#FFE4E4",
  },

  sequencia: {
    titulo: "Sequência",
    emoji: "🔗",
    cor: "#F59E0B",
    corClara: "#FFF8DC",
  },
};

// --- Emojis por categoria ---------------------------------

const EMOJIS = ["🍎", "⭐", "🐶", "🚗", "🎈", "🐢", "🌟", "🦋", "🍕", "🐱"];

function sortearEmoji(): string {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

// --- Gerar perguntas mockadas -----------------------------

function gerarAlternativas(correta: number): number[] {
  const alternativas = new Set<number>([correta]);

  const variacoes = [-3, -2, -1, 1, 2, 3, 4, 5];

  for (const variacao of variacoes) {
    if (alternativas.size >= 4) break;

    const alternativa = correta + variacao;

    if (alternativa >= 0) {
      alternativas.add(alternativa);
    }
  }

  return [...alternativas].sort(() => Math.random() - 0.5);
}

function gerarPergunta(tipo: string, nivel: Nivel): Pergunta {
  const max = nivel === "nivel 1" ? 10 : nivel === "nivel 2" ? 20 : 30;

  // ---------------- CONTAGEM ----------------

  if (tipo === "contagem") {
    const emoji = ["🍎", "⭐", "🐶", "🚗", "🎈", "🐢", "🌟"];

    const qtd = Math.max(1, Math.floor(Math.random() * max));

    return {
      emoji: emoji[Math.floor(Math.random() * emoji.length)],
      quantidadeExibida: qtd,
      respostaCorreta: qtd,
      alternativas: gerarAlternativas(qtd),
    };
  }

  // ---------------- ADIÇÃO ----------------

  if (tipo === "adicao") {
    const p1 = Math.max(1, Math.floor(Math.random() * (max / 2)));

    const p2 = Math.max(1, Math.floor(Math.random() * (max / 2)));

    return {
      emoji: sortearEmoji(),
      parcela1: p1,
      parcela2: p2,
      respostaCorreta: p1 + p2,
      alternativas: gerarAlternativas(p1 + p2),
    };
  }

  // ---------------- SUBTRAÇÃO ----------------

  if (tipo === "subtracao") {
    const min = Math.max(2, Math.floor(Math.random() * max));

    const sub = Math.floor(Math.random() * min);

    return {
      emoji: sortearEmoji(),
      minuendo: min,
      subtraendo: sub,
      respostaCorreta: min - sub,
      alternativas: gerarAlternativas(min - sub),
    };
  }

  // ---------------- SEQUÊNCIA ----------------

  const passo = nivel === "nivel 3" ? Math.floor(Math.random() * 3) + 2 : 1;

  const inicio = Math.max(1, Math.floor(Math.random() * (max - passo * 4)));

  const seq = [0, 1, 2, 3].map((i) => inicio + i * passo);

  const correta = inicio + 4 * passo;

  return {
    sequencia: seq,
    respostaCorreta: correta,
    alternativas: gerarAlternativas(correta),
  };
}

// --- Componentes visuais de pergunta ------------------------------

function QContagem({ p }: { p: Pergunta }) {
  return (
    <View
      style={{
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
        }}
      >
        Quantos {p.emoji} você vê?
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {Array.from({
          length: p.quantidadeExibida ?? 0,
        }).map((_, i) => (
          <Text
            key={i}
            style={{
              fontSize: 32,
            }}
          >
            {p.emoji}
          </Text>
        ))}
      </View>
    </View>
  );
}

function QAdicao({ p }: { p: Pergunta }) {
  return (
    <View
      style={{
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          color: "#1A1A2E",
        }}
      >
        {p.parcela1} + {p.parcela2} = ?
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#D6F5EC",
            borderRadius: 12,
            padding: 12,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 4,
            maxWidth: 130,
            justifyContent: "center",
          }}
        >
          {Array.from({
            length: p.parcela1 ?? 0,
          }).map((_, i) => (
            <Text
              key={i}
              style={{
                fontSize: 22,
              }}
            >
              {p.emoji ?? "🍎"}
            </Text>
          ))}
        </View>

        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#10B981",
          }}
        >
          +
        </Text>

        <View
          style={{
            backgroundColor: "#DBEAFE",
            borderRadius: 12,
            padding: 12,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 4,
            maxWidth: 120,
          }}
        >
          {Array.from({
            length: p.parcela2 ?? 0,
          }).map((_, i) => (
            <Text
              key={i}
              style={{
                fontSize: 22,
              }}
            >
              {p.emoji}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function QSubtracao({ p }: { p: Pergunta }) {
  return (
    <View
      style={{
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text
        style={{
          fontSize: 36,
          fontWeight: "bold",
          color: "#1A1A2E",
        }}
      >
        {p.minuendo} − {p.subtraendo} = ?
      </Text>

      <View
        style={{
          backgroundColor: "#FFE4E4",
          borderRadius: 12,
          padding: 12,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 6,
          maxWidth: 240,
          justifyContent: "center",
        }}
      >
        {Array.from({
          length: p.minuendo ?? 0,
        }).map((_, i) => (
          <Text
            key={i}
            style={{
              fontSize: 22,
              opacity: i >= (p.minuendo ?? 0) - (p.subtraendo ?? 0) ? 0.2 : 1,
            }}
          >
            {p.emoji ?? "🍎"}
          </Text>
        ))}
      </View>

      <Text
        style={{
          fontSize: 12,
          color: "#9CA3AF",
        }}
      >
        Os apagados serão retirados
      </Text>
    </View>
  );
}

function QSequencia({ p }: { p: Pergunta }) {
  return (
    <View
      style={{
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
        }}
      >
        Complete a sequência:
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
        }}
      >
        {(p.sequencia ?? []).map((n, i) => (
          <View
            key={i}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#1A1A2E",
              }}
            >
              {n}
            </Text>
          </View>
        ))}

        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: "#F59E0B",
            borderStyle: "dashed",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFBEB",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#F59E0B",
            }}
          >
            ?
          </Text>
        </View>
      </View>
    </View>
  );
}

// --- Componente de métrica ------------------------------

function MetricaItem({
  label,
  valor,
  cor,
}: {
  label: string;
  valor: string;
  cor: string;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        gap: 4,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: cor,
        }}
      >
        {valor}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: "#9CA3AF",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------
// Tela Principal
// ---------------------------------------------------------

const TOTAL = 8;

const NIVEIS: Nivel[] = ["nivel 1", "nivel 2", "nivel 3"];

export default function Jogo() {
  const { adicionarEstrelas } = useEstrelas();

  const estrelasContabilizadas = useRef(false);

  // -------------------------------------------------------
  // Navegação
  // -------------------------------------------------------

  const { tipo } = useLocalSearchParams<{
    tipo: string;
  }>();

  const router = useRouter();

  const cfg = CONFIG[tipo ?? "contagem"] ?? CONFIG.contagem;

  // -------------------------------------------------------
  // Estados do jogo
  // -------------------------------------------------------

  const [nivel, setNivel] = useState<Nivel>("nivel 1");

  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);

  const [atual, setAtual] = useState(0);

  const [acertos, setAcertos] = useState(0);

  const [respondida, setRespondida] = useState<number | null>(null);

  const [fim, setFim] = useState(false);

  // -------------------------------------------------------
  // Métricas de tempo
  // -------------------------------------------------------

  const [resultados, setResultados] = useState<ResultadoPergunta[]>([]);

  /**
   * Guarda o momento em que a pergunta atual
   * começou a ser respondida.
   */
  const inicioPerguntaRef = useRef<number>(Date.now());

  /**
   * Guarda o timeout utilizado para passar
   * para a próxima pergunta.
   */
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------------------------------------------
  // Gerar perguntas
  // -------------------------------------------------------

  useEffect(() => {
    estrelasContabilizadas.current = false;

    const ps = Array.from({ length: TOTAL }, () =>
      gerarPergunta(tipo ?? "contagem", nivel),
    );

    setPerguntas(ps);
    setAtual(0);
    setAcertos(0);
    setRespondida(null);
    setFim(false);

    // Limpa os resultados da partida anterior
    setResultados([]);

    // Começa a contar a primeira pergunta
    inicioPerguntaRef.current = Date.now();
  }, [tipo, nivel]);

  // -------------------------------------------------------
  // Iniciar cronômetro da pergunta atual
  // -------------------------------------------------------

  useEffect(() => {
    if (!perguntas.length) return;

    inicioPerguntaRef.current = Date.now();
  }, [atual, perguntas.length]);

  // -------------------------------------------------------
  // Limpar timeout quando sair da tela
  // -------------------------------------------------------

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------
  // Contabilizador de estrelas
  // -------------------------------------------------------

  useEffect(() => {
    if (!fim || estrelasContabilizadas.current) {
      return;
    }

    const estrelas = acertos >= 7 ? 3 : acertos >= 5 ? 2 : 1;

    adicionarEstrelas(estrelas);

    estrelasContabilizadas.current = true;
  }, [fim, acertos, adicionarEstrelas]);

  // -------------------------------------------------------
  // Pergunta atual
  // -------------------------------------------------------

  const pergunta = perguntas[atual];

  const progresso = ((atual + 1) / TOTAL) * 100;

  // -------------------------------------------------------
  // Responder pergunta
  // -------------------------------------------------------

  function responder(alt: number) {
    // Impede responder duas vezes
    if (respondida !== null) return;

    // -----------------------------------------------------
    // Calcula o tempo gasto nesta pergunta
    // -----------------------------------------------------

    const fimPergunta = Date.now();

    const tempo = (fimPergunta - inicioPerguntaRef.current) / 1000;

    // Verifica se acertou
    const acertou = alt === pergunta.respostaCorreta;

    // Mostra visualmente a resposta selecionada
    setRespondida(alt);

    // Incrementa os acertos
    if (acertou) {
      setAcertos((a) => a + 1);
    }

    // -----------------------------------------------------
    // Salva o resultado desta pergunta
    // -----------------------------------------------------

    setResultados((resultadosAtuais) => [
      ...resultadosAtuais,
      {
        numero: atual + 1,
        correta: acertou,
        tempo,
      },
    ]);

    // -----------------------------------------------------
    // Aguarda 900ms para mostrar o resultado
    // antes de mudar de pergunta
    // -----------------------------------------------------

    timeoutRef.current = setTimeout(() => {
      if (atual + 1 >= TOTAL) {
        setFim(true);
      } else {
        setAtual((a) => a + 1);
        setRespondida(null);
      }
    }, 900);
  }

  // ---------------------------------------------------------
  // Métricas da partida
  // ---------------------------------------------------------

  const tempoTotal = resultados.reduce(
    (total, resultado) => total + resultado.tempo,
    0,
  );

  const tempoMedio = resultados.length > 0 ? tempoTotal / resultados.length : 0;

  const tempoMaisRapido =
    resultados.length > 0
      ? Math.min(...resultados.map((resultado) => resultado.tempo))
      : 0;

  const tempoMaisLento =
    resultados.length > 0
      ? Math.max(...resultados.map((resultado) => resultado.tempo))
      : 0;

  // ---------------------------------------------------------
  // Tela de resultado
  // ---------------------------------------------------------

  if (fim) {
    const estrelas = acertos >= 7 ? 3 : acertos >= 5 ? 2 : 1;

    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#F8F9FA",
        }}
        contentContainerStyle={{
          padding: 32,
          alignItems: "center",
        }}
      >
        {/* Estrelas */}

        <Text
          style={{
            fontSize: 64,
            marginTop: 30,
          }}
        >
          {"⭐".repeat(estrelas)}
        </Text>

        {/* Título */}

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#1A1A2E",
            marginTop: 16,
          }}
        >
          {acertos === TOTAL
            ? "Perfeito!"
            : acertos >= 6
              ? "Muito bem!"
              : "Continue praticando!"}
        </Text>

        {/* Acertos */}

        <Text
          style={{
            fontSize: 18,
            color: "#6B7280",
            marginTop: 8,
          }}
        >
          {acertos} de {TOTAL} acertos
        </Text>

        {/* -------------------------------------------------
            Resumo das métricas
        ------------------------------------------------- */}

        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
            marginTop: 28,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1A1A2E",
              marginBottom: 20,
            }}
          >
            Tempo de resposta
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <MetricaItem
              label="Tempo médio"
              valor={`${tempoMedio.toFixed(1)}s`}
              cor={cfg.cor}
            />

            <MetricaItem
              label="Mais rápido"
              valor={`${tempoMaisRapido.toFixed(1)}s`}
              cor="#10B981"
            />

            <MetricaItem
              label="Mais lento"
              valor={`${tempoMaisLento.toFixed(1)}s`}
              cor="#EF4444"
            />

            <MetricaItem
              label="Tempo total"
              valor={`${tempoTotal.toFixed(1)}s`}
              cor="#6366F1"
            />
          </View>
        </View>

        {/* -------------------------------------------------
            Resultado por pergunta
        ------------------------------------------------- */}

        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
            marginTop: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1A1A2E",
              marginBottom: 16,
            }}
          >
            Resultado por questão
          </Text>

          {resultados.map((resultado) => (
            <View
              key={resultado.numero}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F3F4F6",
              }}
            >
              {/* Número da questão */}

              <Text
                style={{
                  fontSize: 15,
                  color: "#374151",
                  flex: 1,
                }}
              >
                Questão {resultado.numero}
              </Text>

              {/* Resultado */}

              <Text
                style={{
                  fontSize: 20,
                  marginRight: 16,
                }}
              >
                {resultado.correta ? "✅" : "❌"}
              </Text>

              {/* Tempo */}

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#6B7280",
                  width: 55,
                  textAlign: "right",
                }}
              >
                {resultado.tempo.toFixed(1)}s
              </Text>
            </View>
          ))}
        </View>

        {/* -------------------------------------------------
            Jogar novamente
        ------------------------------------------------- */}

        <TouchableOpacity
          onPress={() => {
            estrelasContabilizadas.current = false;

            setAtual(0);
            setAcertos(0);
            setRespondida(null);
            setFim(false);
            setResultados([]);

            setPerguntas(
              Array.from({ length: TOTAL }, () =>
                gerarPergunta(tipo ?? "contagem", nivel),
              ),
            );

            inicioPerguntaRef.current = Date.now();
          }}
          style={{
            backgroundColor: cfg.cor,
            borderRadius: 16,
            padding: 16,
            marginTop: 24,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Jogar novamente
          </Text>
        </TouchableOpacity>

        {/* -------------------------------------------------
            Voltar ao início
        ------------------------------------------------- */}

        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={{
            borderWidth: 2,
            borderColor: cfg.cor,
            borderRadius: 16,
            padding: 16,
            marginTop: 12,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: cfg.cor,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Voltar ao início
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ---------------------------------------------------------
  // Enquanto as perguntas ainda não foram carregadas
  // ---------------------------------------------------------

  if (!pergunta) return null;

  // ---------------------------------------------------------
  // Tela do jogo
  // ---------------------------------------------------------

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F8F9FA",
      }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 56,
      }}
    >
      {/* ---------------------------------------------------
          Header
      --------------------------------------------------- */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
            }}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#1A1A2E",
          }}
        >
          {cfg.emoji} {cfg.titulo}
        </Text>

        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
            }}
          >
            🏠
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------------------------------------------------
          Progresso
      --------------------------------------------------- */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "#6B7280",
          }}
        >
          {atual + 1} de {TOTAL}
        </Text>

        <Text
          style={{
            fontSize: 13,
            color: cfg.cor,
            fontWeight: "bold",
          }}
        >
          {Math.round(progresso)}%
        </Text>
      </View>

      <View
        style={{
          height: 8,
          backgroundColor: "#E5E7EB",
          borderRadius: 4,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            height: 8,
            backgroundColor: cfg.cor,
            borderRadius: 4,
            width: `${progresso}%`,
          }}
        />
      </View>

      {/* ---------------------------------------------------
          Seletor de nível
      --------------------------------------------------- */}

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {NIVEIS.map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => setNivel(n)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: nivel === n ? cfg.cor : "transparent",
              borderWidth: 1,
              borderColor: nivel === n ? cfg.cor : "#D1D5DB",
            }}
          >
            <Text
              style={{
                color: nivel === n ? "white" : "#6B7280",
                fontWeight: nivel === n ? "bold" : "normal",
                textTransform: "capitalize",
              }}
            >
              {n.charAt(0).toUpperCase() + n.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ---------------------------------------------------
          Card da pergunta
      --------------------------------------------------- */}

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          padding: 24,
          borderWidth: 2,
          borderColor: cfg.corClara,
          marginBottom: 24,
          alignItems: "center",
          minHeight: 180,
          justifyContent: "center",
        }}
      >
        {tipo === "contagem" && <QContagem p={pergunta} />}

        {tipo === "adicao" && <QAdicao p={pergunta} />}

        {tipo === "subtracao" && <QSubtracao p={pergunta} />}

        {tipo === "sequencia" && <QSequencia p={pergunta} />}
      </View>

      {/* ---------------------------------------------------
          Alternativas
      --------------------------------------------------- */}

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {pergunta.alternativas.map((alt, i) => {
          const correta = alt === pergunta.respostaCorreta;

          const selecionada = respondida === alt;

          let bg = "white";
          let border = "#E5E7EB";

          if (respondida !== null && correta) {
            bg = "#D1FAE5";
            border = "#10B981";
          } else if (selecionada && !correta) {
            bg = "#FEE2E2";
            border = "#EF4444";
          }

          return (
            <TouchableOpacity
              key={i}
              onPress={() => responder(alt)}
              style={{
                width: "47%",
                backgroundColor: bg,
                borderWidth: 2,
                borderColor: border,
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#1A1A2E",
                }}
              >
                {respondida !== null && correta ? `✅ ${alt}` : alt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
