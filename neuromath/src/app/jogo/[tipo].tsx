import { useEstrelas } from "@/context/EstrelasContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// --- Types -------------------------

type Nivel = "nivel 1" | "nivel 2" | "nivel 3";

interface Pergunta {
  alternativas: number[];
  respostaCorreta: number;
  //contagem
  emoji?: string;
  quantidadeExibida?: number;
  //adicao
  parcela1?: number;
  parcela2?: number;
  //subtracao
  minuendo?: number;
  subtraendo?: number;
  //sequencia
  sequencia?: number[];
}

// --- Config Visual por type -----------------------
const CONFIG: Record<
  string,
  { titulo: string; emoji: string; cor: string; corClara: string }
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

//--- Gerar perguntas mockadas -----------------------------

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

  console.log("🎲 alternativas geradas: ", {
    correta,
    alternativas: [...alternativas],
  });

  return [...alternativas].sort(() => Math.random() - 0.5);
}

function gerarPergunta(tipo: string, nivel: Nivel): Pergunta {
  const max = nivel === "nivel 1" ? 10 : nivel === "nivel 2" ? 20 : 30;

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

  if (tipo === "adicao") {
    const p1 = Math.max(1, Math.floor(Math.random() * (max / 2)));
    const p2 = Math.max(1, Math.floor(Math.random() * (max / 2)));
    return {
      parcela1: p1,
      parcela2: p2,
      respostaCorreta: p1 + p2,
      alternativas: gerarAlternativas(p1 + p2),
    };
  }

  if (tipo === "subtracao") {
    const min = Math.max(2, Math.floor(Math.random() * max));
    const sub = Math.floor(Math.random() * min);
    return {
      minuendo: min,
      subtraendo: sub,
      respostaCorreta: min - sub,
      alternativas: gerarAlternativas(min - sub),
    };
  }

  //sequencia
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
    <View style={{ alignItems: "center", gap: 12 }}>
      <Text style={{ fontSize: 16, color: "#6B7280" }}>
        Quantos {p.emoji} você vê?
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {Array.from({ length: p.quantidadeExibida ?? 0 }).map((_, i) => (
          <Text key={i} style={{ fontSize: 32 }}>
            {p.emoji}
          </Text>
        ))}
      </View>
    </View>
  );
}

function QAdicao({ p }: { p: Pergunta }) {
  return (
    <View style={{ alignItems: "center", gap: 8 }}>
      <Text style={{ fontSize: 40, fontWeight: "bold", color: "#1A1A2E" }}>
        {p.parcela1} + {p.parcela2} = ?
      </Text>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#D6F5EC",
            borderRadius: 12,
            padding: 12,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 4,
            maxWidth: 120,
          }}
        >
          {Array.from({ length: p.parcela1 ?? 0 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: "#10B981",
              }}
            />
          ))}
        </View>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>+</Text>
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
          {Array.from({ length: p.parcela2 ?? 0 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: "#3B82F6",
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function QSubtracao({ p }: { p: Pergunta }) {
  return (
    <View style={{ alignItems: "center", gap: 8 }}>
      <Text style={{ fontSize: 40, fontWeight: "bold", color: "#1A1A2E" }}>
        {p.minuendo} - {p.subtraendo} = ?
      </Text>
      <View
        style={{
          backgroundColor: "#FFE4E4",
          borderRadius: 12,
          padding: 12,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 6,
          maxWidth: 220,
          justifyContent: "center",
        }}
      >
        {Array.from({ length: p.minuendo ?? 0 }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: i < (p.subtraendo ?? 0) ? "#FCA5A5" : "#EF4444",
            }}
          />
        ))}
      </View>
    </View>
  );
}

function QSequencia({ p }: { p: Pergunta }) {
  return (
    <View style={{ alignItems: "center", gap: 12 }}>
      <Text style={{ fontSize: 16, color: "#6B7280" }}>
        Complete a sequência:
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
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
              style={{ fontSize: 20, fontWeight: "bold", color: "#1A1A2E" }}
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
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#F59E0B" }}>
            ?
          </Text>
        </View>
      </View>
    </View>
  );
}

//---- Tela Principal -------------------------------------------------

const TOTAL = 8;
const NIVEIS: Nivel[] = ["nivel 1", "nivel 2", "nivel 3"];

export default function Jogo() {
  const { adicionarEstrelas } = useEstrelas();
  const estrelasContabilizadas = useRef(false);

  const { tipo } = useLocalSearchParams<{ tipo: string }>();
  const router = useRouter();
  const cfg = CONFIG[tipo ?? "contagem"] ?? CONFIG.contagem;

  const [nivel, setNivel] = useState<Nivel>("nivel 1");
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [atual, setAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respondida, setRespondida] = useState<number | null>(null);
  const [fim, setFim] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gera 8 perguntas ao montar ou trocar nível
  useEffect(() => {
    console.log("Jogo montado tipo=", tipo);
    const ps = Array.from({ length: TOTAL }, () =>
      gerarPergunta(tipo ?? "contagem", nivel),
    );
    setPerguntas(ps);
    setAtual(0);
    setAcertos(0);
    setRespondida(null);
    setFim(false);
  }, [tipo, nivel]);

  const pergunta = perguntas[atual];
  const progresso = ((atual + 1) / TOTAL) * 100;

  function responder(alt: number) {
    if (respondida !== null) return;
    setRespondida(alt);
    const acertou = alt === pergunta.respostaCorreta;
    if (acertou) setAcertos((a) => a + 1);

    setTimeout(() => {
      if (atual + 1 >= TOTAL) {
        setFim(true);
      } else {
        setAtual((a) => a + 1);
        setRespondida(null);
      }
    }, 900);
  }

  // ── Tela de resultado ──
  if (fim) {
    const estrelas = acertos >= 7 ? 3 : acertos >= 5 ? 2 : 1;

    if (!estrelasContabilizadas.current) {
      adicionarEstrelas(estrelas);
      estrelasContabilizadas.current = true;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F9FA",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <Text style={{ fontSize: 64 }}>{"⭐".repeat(estrelas)}</Text>
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
        <Text style={{ fontSize: 18, color: "#6B7280", marginTop: 8 }}>
          {acertos} de {TOTAL} acertos
        </Text>
        <TouchableOpacity
          onPress={() => {
            setAtual(0);
            setAcertos(0);
            setRespondida(null);
            setFim(false);
            setPerguntas(
              Array.from({ length: TOTAL }, () =>
                gerarPergunta(tipo ?? "contagem", nivel),
              ),
            );
          }}
          style={{
            backgroundColor: cfg.cor,
            borderRadius: 16,
            padding: 16,
            marginTop: 32,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Jogar novamente
          </Text>
        </TouchableOpacity>
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
          <Text style={{ color: cfg.cor, fontWeight: "bold", fontSize: 16 }}>
            Voltar ao início
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!pergunta) return null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8F9FA" }}
      contentContainerStyle={{ padding: 24, paddingTop: 56 }}
    >
      {/* Header */}
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
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1A1A2E" }}>
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
          <Text style={{ fontSize: 18 }}>🏠</Text>
        </TouchableOpacity>
      </View>

      {/* Progresso */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text style={{ fontSize: 13, color: "#6B7280" }}>
          {atual + 1} de {TOTAL}
        </Text>
        <Text style={{ fontSize: 13, color: cfg.cor, fontWeight: "bold" }}>
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

      {/* Seletor de nível */}
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

      {/* Card da pergunta */}
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

      {/* Alternativas */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
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
                style={{ fontSize: 28, fontWeight: "bold", color: "#1A1A2E" }}
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
