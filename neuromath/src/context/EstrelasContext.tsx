import { createContext, ReactNode, useContext, useState } from "react";

interface EstrelasContextData {
  estrelas: number;
  adicionarEstrelas: (quantidade: number) => void;
}

const EstrelasContext = createContext<EstrelasContextData | undefined>(
  undefined,
);

export function EstrelasProvider({ children }: { children: ReactNode }) {
  const [estrelas, setEstrelas] = useState(0);

  function adicionarEstrelas(quantidade: number) {
    setEstrelas((atual) => atual + quantidade);
  }

  return (
    <EstrelasContext.Provider
      value={{
        estrelas,
        adicionarEstrelas,
      }}
    >
      {children}
    </EstrelasContext.Provider>
  );
}

export function useEstrelas() {
  const context = useContext(EstrelasContext);

  if (!context) {
    throw new Error("useEstrelas deve ser usado dentro de um EstrelasProvider");
  }

  return context;
}
